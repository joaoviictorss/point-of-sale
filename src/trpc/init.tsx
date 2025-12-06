import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import { verifySession } from "@/lib/session";
import { errorHandler, prismaCodeToTRPC } from "@/lib/error-handler";
import { Prisma } from "@prisma/client";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const session = await verifySession();
  return session;
});

const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

const errorTransformerMiddleware = t.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: prismaCodeToTRPC(error.code),
        message: "Erro ao processar solicitação",
        cause: error,
      });
    }

    throw errorHandler.internal("Erro interno do servidor", error);
  }
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(errorTransformerMiddleware);

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await verifySession();

  if (!session?.userId) {
    throw errorHandler.unauthorized();
  }

  return next({
    ctx: {
      ...ctx,
      auth: session,
    },
  });
});
