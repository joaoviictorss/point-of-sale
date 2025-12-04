import { z } from "zod";
import { prisma } from "@/lib/prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { slugify } from "@/utils";
import { findOrganizationByUserId } from "@/utils/organizations";

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await prisma.organization.create({
        data: {
          name: input.name,
          ownerId: ctx.auth.userId,
          slug: slugify(input.name),
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
