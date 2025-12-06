import { z } from 'zod';
import { prisma } from '@/lib/prisma/client';
import { errorHandler } from '@/lib/error-handler';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { slugify } from '@/utils';
import { findOrganizationByUserId } from '@/utils/organizations';

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1, 'Nome é obrigatório') }))
    .mutation(async ({ ctx, input }) => {
      const slug = slugify(input.name);

      const exists = await prisma.organization.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (exists) {
        throw errorHandler.conflict('Já existe uma organização com este nome');
      }

      return await prisma.organization.create({
        data: {
          name: input.name,
          ownerId: ctx.auth.userId,
          slug,
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.organization.findMany({
      where: {
        ownerId: ctx.auth.userId,
      },
    });
  }),

  getOrganizationsFromUser: protectedProcedure.query(async ({ ctx }) => {
    return await findOrganizationByUserId(ctx.auth.userId);
  }),
});
