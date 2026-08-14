import type { Prisma } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';
import { errorHandler } from '@/lib/error-handler';
import { prisma } from '@/lib/prisma/client';
import { createTRPCRouter, organizationProcedure } from '@/trpc/init';
import {
  createSaleSchema,
  getAllSalesFromOrganizationSchema,
  getSaleByIdSchema,
} from './schemas';

export const salesRouter = createTRPCRouter({
  create: organizationProcedure
    .input(createSaleSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: organizationId, slug: organizationSlug } = ctx.organization;
      const employeeId = ctx.auth.userId;

      // Buscar produtos da venda (validando que pertencem à organização)
      const productIds = [
        ...new Set(input.items.map((item) => item.productId)),
      ];
      const products = await prisma.product.findMany({
        where: { id: { in: productIds }, organizationSlug },
      });

      if (products.length !== productIds.length) {
        throw errorHandler.notFound('Produto');
      }

      const productMap = new Map(
        products.map((product) => [product.id, product])
      );

      // Montar itens com snapshot e calcular subtotal (tudo em centavos)
      let itemsSubtotal = 0;
      const itemsData = input.items.map((item) => {
        const product = productMap.get(item.productId);

        if (!product) {
          throw errorHandler.notFound('Produto');
        }

        const unitPrice = product.salePrice;
        const totalPrice =
          Math.round(unitPrice * item.quantity) - item.discount;

        if (totalPrice < 0) {
          throw errorHandler.badRequest(
            `Desconto do item "${product.name}" é maior que o valor do item`
          );
        }

        itemsSubtotal += totalPrice;

        return {
          productId: product.id,
          productName: product.name,
          productCode: product.code,
          quantity: item.quantity,
          unitPrice,
          discount: item.discount,
          totalPrice,
        };
      });

      // Desconto da venda inteira
      const discountAmount =
        input.discountType === 'PERCENT'
          ? Math.round((itemsSubtotal * input.discount) / 10_000)
          : input.discount;

      if (discountAmount > itemsSubtotal) {
        throw errorHandler.badRequest(
          'Desconto da venda é maior que o subtotal dos itens'
        );
      }

      const finalAmount = itemsSubtotal - discountAmount + input.tax;

      // A soma dos pagamentos precisa fechar com o total da venda
      const paymentsTotal = input.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      if (paymentsTotal !== finalAmount) {
        throw errorHandler.badRequest(
          'A soma dos pagamentos não corresponde ao total da venda'
        );
      }

      // Cliente é opcional; se informado, precisa ser da organização
      if (input.customerId) {
        const customer = await prisma.customer.findFirst({
          where: { id: input.customerId, organizationId },
          select: { id: true },
        });

        if (!customer) {
          throw errorHandler.notFound('Cliente');
        }
      }

      let sellerName: string | undefined;
      if (input.sellerId) {
        const seller = await prisma.seller.findFirst({
          where: { id: input.sellerId, organizationId, active: true },
          select: { name: true },
        });

        if (!seller) {
          throw errorHandler.notFound('Vendedor');
        }
        sellerName = seller.name;
      }

      return await prisma.$transaction(async (tx) => {
        // Número sequencial legível, por organização
        const lastOrder = await tx.order.findFirst({
          where: { organizationId },
          orderBy: { orderNumber: 'desc' },
          select: { orderNumber: true },
        });
        const orderNumber = (lastOrder?.orderNumber ?? 0) + 1;

        // Cliente: usa o existente ou cria inline a partir dos dados da venda
        let customerId = input.customerId;
        if (!customerId && input.customer?.name) {
          const created = await tx.customer.create({
            data: {
              name: input.customer.name,
              phone: input.customer.phone || null,
              email: input.customer.email || null,
              organizationId,
            },
            select: { id: true },
          });
          customerId = created.id;
        }

        const order = await tx.order.create({
          data: {
            orderNumber,
            status: 'COMPLETED',
            itemsSubtotal,
            discount: input.discount,
            discountType: input.discountType,
            tax: input.tax,
            finalAmount,
            notes: input.notes,
            employeeId,
            organizationId,
            customerId,
            sellerId: input.sellerId,
            sellerName,
            items: { create: itemsData },
            payments: {
              create: input.payments.map((payment) => ({
                method: payment.method,
                amount: payment.amount,
                installments: payment.installments,
                status: 'PAID',
                paidAt: new Date(),
              })),
            },
          },
          include: { items: true, payments: true },
        });

        // Baixa de estoque com rastreio. O estoque pode ficar negativo de
        // propósito: nem toda loja mantém o controle de estoque em dia.
        // Sequencial de propósito: rodar queries concorrentes no client de
        // transação do Prisma é desaconselhado.
        for (const item of itemsData) {
          // decremento atômico evita race condition e já retorna o novo estoque
          // biome-ignore lint/nursery/noAwaitInLoop: operações transacionais devem ser sequenciais
          const updated = await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
            select: { stock: true },
          });

          await tx.stockMovement.create({
            data: {
              type: 'SALE',
              quantity: -item.quantity,
              stockBefore: updated.stock + item.quantity,
              stockAfter: updated.stock,
              productId: item.productId,
              orderId: order.id,
              createdById: employeeId,
              organizationId,
            },
          });
        }

        return order;
      });
    }),

  getAllFromOrganization: organizationProcedure
    .input(getAllSalesFromOrganizationSchema)
    .query(async ({ ctx, input }) => {
      const { id: organizationId } = ctx.organization;
      const { page, pageSize, search, from, to } = input;

      // Filtro de período por data da venda. `to` é inclusivo até o fim do dia.
      // Caveat: `from`/`to` chegam como meia-noite UTC (parseAsIsoDate) e o
      // fim/início do dia é calculado no fuso do servidor — suficiente para v1.
      const createdAtFilter: Prisma.DateTimeFilter = {};
      if (from) {
        createdAtFilter.gte = startOfDay(from);
      }
      if (to) {
        createdAtFilter.lte = endOfDay(to);
      }

      const searchAsNumber = Number(search);
      const where: Prisma.OrderWhereInput = {
        organizationId,
        ...(from || to ? { createdAt: createdAtFilter } : {}),
        ...(search.trim()
          ? {
              OR: [
                {
                  customer: {
                    name: { contains: search, mode: 'insensitive' },
                  },
                },
                ...(Number.isInteger(searchAsNumber)
                  ? [{ orderNumber: searchAsNumber }]
                  : []),
              ],
            }
          : {}),
      };

      const [items, totalCount, aggregates] = await Promise.all([
        prisma.order.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: { select: { id: true, name: true } },
            employee: { select: { id: true, name: true } },
            seller: { select: { id: true, name: true } },
            payments: { select: { method: true } },
            _count: { select: { items: true } },
          },
        }),
        prisma.order.count({ where }),
        prisma.order.aggregate({ where, _sum: { finalAmount: true } }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      // Agregados do período (respeitam o mesmo filtro da listagem, não só a
      // página atual) para alimentar a régua de estatísticas.
      const totalRevenue = aggregates._sum.finalAmount ?? 0;
      const averageTicket =
        totalCount > 0 ? Math.round(totalRevenue / totalCount) : 0;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        summary: {
          totalRevenue,
          salesCount: totalCount,
          averageTicket,
        },
      };
    }),

  getById: organizationProcedure
    .input(getSaleByIdSchema)
    .query(async ({ ctx, input }) => {
      const order = await prisma.order.findUnique({
        where: { id: input.id },
        include: {
          items: true,
          payments: true,
          invoice: true,
          customer: true,
          employee: { select: { id: true, name: true, email: true } },
          seller: { select: { id: true, name: true } },
        },
      });

      if (!order || order.organizationId !== ctx.organization.id) {
        throw errorHandler.notFound('Venda');
      }

      return order;
    }),
});
