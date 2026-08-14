import type { Prisma } from '@prisma/client';
import { errorHandler } from '@/lib/error-handler';
import { prisma } from '@/lib/prisma/client';
import { createTRPCRouter, organizationProcedure } from '@/trpc/init';
import {
  deleteSellerSchema,
  getAllSellersFromOrganizationSchema,
  getSellerByIdSchema,
  sellerFormSchema,
  updateSellerSchema,
} from './schemas';

const normalizeCode = (code?: string) => code?.trim() || null;

export const sellerRouter = createTRPCRouter({
  create: organizationProcedure
    .input(sellerFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: organizationId } = ctx.organization;
      const code = normalizeCode(input.code);

      if (code) {
        const existingSeller = await prisma.seller.findFirst({
          where: { code, organizationId },
          select: { id: true },
        });

        if (existingSeller) {
          throw errorHandler.conflict('Já existe um vendedor com este código');
        }
      }

      return await prisma.seller.create({
        data: {
          name: input.name,
          code,
          active: input.active,
          organizationId,
        },
      });
    }),

  getAllFromOrganization: organizationProcedure
    .input(getAllSellersFromOrganizationSchema)
    .query(async ({ ctx, input }) => {
      const { id: organizationId } = ctx.organization;
      const { page, pageSize, search, status } = input;

      const where: Prisma.SellerWhereInput = {
        organizationId,
        ...(status === 'all' ? {} : { active: status === 'active' }),
        ...(search.trim()
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { code: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      };

      const [items, totalCount] = await Promise.all([
        prisma.seller.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          orderBy: [{ active: 'desc' }, { name: 'asc' }],
        }),
        prisma.seller.count({ where }),
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

  // Lista enxuta e sem paginação para o seletor de vendedor do PDV
  getActiveOptions: organizationProcedure.query(async ({ ctx }) => {
    return await prisma.seller.findMany({
      where: { organizationId: ctx.organization.id, active: true },
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' },
    });
  }),

  getById: organizationProcedure
    .input(getSellerByIdSchema)
    .query(async ({ ctx, input }) => {
      const seller = await prisma.seller.findFirst({
        where: { id: input.id, organizationId: ctx.organization.id },
      });

      if (!seller) {
        throw errorHandler.notFound('Vendedor');
      }

      return seller;
    }),

  update: organizationProcedure
    .input(updateSellerSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: organizationId } = ctx.organization;
      const code = normalizeCode(input.code);

      const existingSeller = await prisma.seller.findFirst({
        where: { id: input.id, organizationId },
        select: { id: true },
      });

      if (!existingSeller) {
        throw errorHandler.notFound('Vendedor');
      }

      if (code) {
        const sellerWithSameCode = await prisma.seller.findFirst({
          where: { code, organizationId, id: { not: input.id } },
          select: { id: true },
        });

        if (sellerWithSameCode) {
          throw errorHandler.conflict('Já existe um vendedor com este código');
        }
      }

      return await prisma.seller.update({
        where: { id: input.id },
        data: {
          name: input.name,
          code,
          active: input.active,
        },
      });
    }),

  delete: organizationProcedure
    .input(deleteSellerSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: organizationId } = ctx.organization;

      const existingSeller = await prisma.seller.findFirst({
        where: { id: input.id, organizationId },
        select: { id: true },
      });

      if (!existingSeller) {
        throw errorHandler.notFound('Vendedor');
      }

      // Excluir um vendedor com vendas apagaria o vínculo do histórico; nesse
      // caso o caminho é arquivar (active = false).
      const salesCount = await prisma.order.count({
        where: { sellerId: input.id },
      });

      if (salesCount > 0) {
        throw errorHandler.conflict(
          'Este vendedor já possui vendas registradas. Arquive-o em vez de excluir.'
        );
      }

      return await prisma.seller.delete({
        where: { id: input.id },
      });
    }),
});
