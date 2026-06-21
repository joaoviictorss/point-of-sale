import { z } from "zod";
import { errorHandler } from "@/lib/error-handler";
import { prisma } from "@/lib/prisma/client";
import {
  createTRPCRouter,
  organizationProcedure,
  protectedProcedure,
} from "@/trpc/init";
import {
  deleteProductSchema,
  getAllProductsFromOrganizationSchema,
  getProductByIdSchema,
  productFormSchema,
} from "./schemas";

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
        throw errorHandler.conflict("Já existe um produto com este código");
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
              { name: { contains: search, mode: "insensitive" } },
              { code: { contains: search, mode: "insensitive" } },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.product.count({
          where: {
            organizationSlug,
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { code: { contains: search, mode: "insensitive" } },
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
        throw errorHandler.notFound("Produto");
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
        throw errorHandler.forbidden("Você não tem acesso a este produto");
      }

      return product;
    }),

  update: organizationProcedure
    .input(
      z.object({
        id: z.string().uuid("ID inválido"),
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
        throw errorHandler.notFound("Produto");
      }

      // Verificar se o produto pertence à organização do contexto
      if (existingProduct.organizationSlug !== organizationSlug) {
        throw errorHandler.forbidden("Você não tem acesso a este produto");
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
        throw errorHandler.notFound("Produto");
      }

      if (existingProduct.organizationSlug !== organizationSlug) {
        throw errorHandler.forbidden("Você não tem acesso a este produto");
      }

      return await prisma.product.delete({
        where: { id: input.id },
      });
    }),
});
