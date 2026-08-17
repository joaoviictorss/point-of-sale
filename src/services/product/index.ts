import { z } from 'zod';
import { errorHandler } from '@/lib/error-handler';
import { prisma } from '@/lib/prisma/client';
import {
  createTRPCRouter,
  organizationProcedure,
  protectedProcedure,
} from '@/trpc/init';
import { type ImportRowResult, parseImportRow } from './import-schemas';
import {
  deleteProductSchema,
  getAllProductsFromOrganizationSchema,
  getProductByIdSchema,
  productFormSchema,
} from './schemas';

export const productRouter = createTRPCRouter({
  create: organizationProcedure
    .input(productFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { slug: organizationSlug } = ctx.organization;

      // Verificar se código já existe na organização
      const existingProduct = await prisma.product.findFirst({
        where: {
          code: input.code,
          organizationSlug,
        },
        select: { id: true },
      });

      if (existingProduct) {
        throw errorHandler.conflict('Já existe um produto com este código');
      }

      return await prisma.product.create({
        data: {
          name: input.name,
          code: input.code,
          costPrice: input.costPrice,
          salePrice: input.salePrice,
          category: input.category,
          productType: input.productType,
          stock: input.stock,
          stockUnit: input.stockUnit,
          minStock: input.minStock,
          maxStock: input.maxStock,
          organizationSlug,
          medias: {
            connect: input.medias.map((id) => ({ id })),
          },
        },
        include: {
          medias: true,
        },
      });
    }),

  getAllFromOrganization: organizationProcedure
    .input(getAllProductsFromOrganizationSchema)
    .query(async ({ ctx, input }) => {
      const { slug: organizationSlug } = ctx.organization;
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.product.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            organizationSlug,
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
            ],
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            medias: { take: 1, select: { url: true, alt: true } },
          },
        }),
        prisma.product.count({
          where: {
            organizationSlug,
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
            ],
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),

  getById: protectedProcedure
    .input(getProductByIdSchema)
    .query(async ({ ctx, input }) => {
      const product = await prisma.product.findUnique({
        where: { id: input.id },
        include: { medias: true },
      });

      if (!product) {
        throw errorHandler.notFound('Produto');
      }

      // Verificar acesso à organização do produto
      const hasAccess = await prisma.organization.findFirst({
        where: {
          slug: product.organizationSlug,
          OR: [
            { ownerId: ctx.auth.userId },
            { members: { some: { userId: ctx.auth.userId } } },
          ],
        },
        select: { id: true },
      });

      if (!hasAccess) {
        throw errorHandler.forbidden('Você não tem acesso a este produto');
      }

      return product;
    }),

  update: organizationProcedure
    .input(
      z.object({
        id: z.string().uuid('ID inválido'),
        ...productFormSchema.shape,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { slug: organizationSlug } = ctx.organization;

      const existingProduct = await prisma.product.findUnique({
        where: { id: input.id },
        select: { organizationSlug: true },
      });

      if (!existingProduct) {
        throw errorHandler.notFound('Produto');
      }

      // Verificar se o produto pertence à organização do contexto
      if (existingProduct.organizationSlug !== organizationSlug) {
        throw errorHandler.forbidden('Você não tem acesso a este produto');
      }

      return await prisma.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          code: input.code,
          costPrice: input.costPrice,
          salePrice: input.salePrice,
          category: input.category,
          productType: input.productType,
          stock: input.stock,
          stockUnit: input.stockUnit,
          minStock: input.minStock,
          maxStock: input.maxStock,
          organizationSlug,
          medias: {
            set: input.medias.map((id) => ({ id })),
          },
        },
        include: {
          medias: true,
        },
      });
    }),

  delete: organizationProcedure
    .input(deleteProductSchema)
    .mutation(async ({ ctx, input }) => {
      const { slug: organizationSlug } = ctx.organization;

      const existingProduct = await prisma.product.findUnique({
        where: { id: input.id },
        select: { organizationSlug: true },
      });

      if (!existingProduct) {
        throw errorHandler.notFound('Produto');
      }

      if (existingProduct.organizationSlug !== organizationSlug) {
        throw errorHandler.forbidden('Você não tem acesso a este produto');
      }

      return await prisma.product.delete({
        where: { id: input.id },
      });
    }),

  validateImportRows: organizationProcedure
    .input(z.object({ rows: z.array(z.record(z.string(), z.unknown())) }))
    .mutation(async ({ ctx, input }) => {
      const { slug: organizationSlug } = ctx.organization;

      const parsedRows = input.rows.map((row, index) =>
        parseImportRow(row, index + 2)
      );

      const codeOccurrences = new Map<string, number>();
      for (const { data } of parsedRows) {
        if (data.code) {
          codeOccurrences.set(
            data.code,
            (codeOccurrences.get(data.code) ?? 0) + 1
          );
        }
      }

      const codesInSheet = [...codeOccurrences.keys()];
      const existingProducts = codesInSheet.length
        ? await prisma.product.findMany({
            where: { organizationSlug, code: { in: codesInSheet } },
            select: { code: true },
          })
        : [];
      const existingCodes = new Set(existingProducts.map((p) => p.code));

      const results: ImportRowResult[] = parsedRows.map((row) => {
        const errors = { ...row.errors };
        const { code } = row.data;

        if (code && !errors.code) {
          if (existingCodes.has(code)) {
            errors.code = 'Código já cadastrado nesta organização';
          } else if ((codeOccurrences.get(code) ?? 0) > 1) {
            errors.code = 'Código duplicado na planilha';
          }
        }

        return {
          ...row,
          errors,
          status:
            Object.keys(errors).length === 0
              ? ('valid' as const)
              : ('invalid' as const),
        };
      });

      return results;
    }),

  createBatch: organizationProcedure
    .input(z.object({ products: z.array(productFormSchema) }))
    .mutation(async ({ ctx, input }) => {
      const { slug: organizationSlug } = ctx.organization;

      if (input.products.length === 0) {
        throw errorHandler.badRequest('Nenhum produto para cadastrar');
      }

      const codes = input.products.map((product) => product.code);
      if (new Set(codes).size !== codes.length) {
        throw errorHandler.conflict(
          'Existem códigos duplicados entre os produtos enviados'
        );
      }

      const existing = await prisma.product.findMany({
        where: { organizationSlug, code: { in: codes } },
        select: { code: true },
      });

      if (existing.length > 0) {
        throw errorHandler.conflict(
          `Os códigos já existem: ${existing.map((p) => p.code).join(', ')}`
        );
      }

      const created = await prisma.$transaction(
        input.products.map((product) =>
          prisma.product.create({
            data: {
              name: product.name,
              code: product.code,
              costPrice: product.costPrice,
              salePrice: product.salePrice,
              category: product.category,
              productType: product.productType,
              stock: product.stock,
              stockUnit: product.stockUnit,
              minStock: product.minStock,
              maxStock: product.maxStock,
              organizationSlug,
            },
          })
        )
      );

      return { count: created.length };
    }),
});
