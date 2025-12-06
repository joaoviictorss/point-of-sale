import { z } from "zod";
import { errorHandler } from "@/lib/error-handler";
import { prisma } from "@/lib/prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
  deleteProductSchema,
  getAllProductsFromOrganizationSchema,
  getProductByIdSchema,
  productFormSchema,
} from "./schemas";

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(productFormSchema)
    .mutation(async ({ input }) => {
      // Verificar se código já existe na organização
      const existingProduct = await prisma.product.findFirst({
        where: {
          code: input.code,
          organizationSlug: input.organizationSlug,
        },
        select: { id: true },
      });

      if (existingProduct) {
        throw errorHandler.conflict("Já existe um produto com este código");
      }

      // Criar produto e conectar mídias existentes
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
          organizationSlug: input.organizationSlug,
          medias: {
            connect: input.medias.map((id) => ({ id })),
          },
        },
        include: {
          medias: true,
        },
      });
    }),

  getAllFromOrganization: protectedProcedure
    .input(getAllProductsFromOrganizationSchema)
    .query(async ({ input }) => {
      const { page, pageSize, search } = input;
      const [items, totalCount] = await Promise.all([
        prisma.product.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            organizationSlug: input.organizationSlug,
            name: { contains: search, mode: "insensitive" },
            code: { contains: search, mode: "insensitive" },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.product.count({
          where: {
            organizationSlug: input.organizationSlug,
            name: { contains: search, mode: "insensitive" },
            code: { contains: search, mode: "insensitive" },
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
    .query(async ({ input }) => {
      return await prisma.product.findUnique({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid("ID inválido"),
        ...productFormSchema.shape,
      })
    )
    .mutation(async ({ input }) => {
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
          organizationSlug: input.organizationSlug,
          medias: {
            connect: input.medias.map((id) => ({ id })),
          },
        },
        include: {
          medias: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(deleteProductSchema)
    .mutation(async ({ input }) => {
      return await prisma.product.delete({
        where: { id: input.id },
      });
    }),
});
