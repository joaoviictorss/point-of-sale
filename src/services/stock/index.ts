import type { Prisma } from '@prisma/client';
import { errorHandler } from '@/lib/error-handler';
import { prisma } from '@/lib/prisma/client';
import { createTRPCRouter, organizationProcedure } from '@/trpc/init';
import {
  createStockMovementSchema,
  getAllStockMovementsFromOrganizationSchema,
} from './schemas';

export const stockRouter = createTRPCRouter({
  createMovement: organizationProcedure
    .input(createStockMovementSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: organizationId, slug: organizationSlug } = ctx.organization;
      const createdById = ctx.auth.userId;

      const product = await prisma.product.findFirst({
        where: { id: input.productId, organizationSlug },
        select: { id: true, stock: true },
      });

      if (!product) {
        throw errorHandler.notFound('Produto');
      }

      if (input.type === 'ADJUSTMENT' && product.stock + input.quantity < 0) {
        throw errorHandler.badRequest('O ajuste deixaria o estoque negativo');
      }

      return await prisma.$transaction(async (tx) => {
        const updated = await tx.product.update({
          where: { id: input.productId },
          data: {
            stock: { increment: input.quantity },
            ...(input.type === 'PURCHASE' && input.unitCost !== undefined
              ? { costPrice: input.unitCost }
              : {}),
          },
          select: { stock: true },
        });

        return await tx.stockMovement.create({
          data: {
            type: input.type,
            quantity: input.quantity,
            stockBefore: updated.stock - input.quantity,
            stockAfter: updated.stock,
            reason: input.reason,
            unitCost: input.type === 'PURCHASE' ? input.unitCost : undefined,
            productId: input.productId,
            createdById,
            organizationId,
          },
        });
      });
    }),

  getAllFromOrganization: organizationProcedure
    .input(getAllStockMovementsFromOrganizationSchema)
    .query(async ({ ctx, input }) => {
      const { id: organizationId } = ctx.organization;
      const { page, pageSize, productId, type } = input;

      const where: Prisma.StockMovementWhereInput = {
        organizationId,
        ...(productId ? { productId } : {}),
        ...(type ? { type } : {}),
      };

      const [items, totalCount] = await Promise.all([
        prisma.stockMovement.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          orderBy: { createdAt: 'desc' },
          include: {
            product: { select: { id: true, name: true, code: true } },
            createdBy: { select: { id: true, name: true } },
            order: { select: { id: true, orderNumber: true } },
          },
        }),
        prisma.stockMovement.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),
});
