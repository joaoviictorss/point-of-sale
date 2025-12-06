import { TRPCError } from '@trpc/server';

export const errorHandler = {
  notFound: (entity: string) =>
    new TRPCError({
      code: 'NOT_FOUND',
      message: `${entity} não encontrado(a)`,
    }),

  conflict: (message: string) =>
    new TRPCError({
      code: 'CONFLICT',
      message,
    }),

  badRequest: (message: string) =>
    new TRPCError({
      code: 'BAD_REQUEST',
      message,
    }),

  forbidden: (message = 'Você não tem permissão para esta ação') =>
    new TRPCError({
      code: 'FORBIDDEN',
      message,
    }),

  unauthorized: (message = 'Não autorizado') =>
    new TRPCError({
      code: 'UNAUTHORIZED',
      message,
    }),

  internal: (message = 'Erro interno do servidor', cause?: unknown) =>
    new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      cause,
    }),
};

export const prismaCodeToTRPC = (
  code: string
): 'CONFLICT' | 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR' => {
  const map: Record<
    string,
    'CONFLICT' | 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR'
  > = {
    P2002: 'CONFLICT',
    P2025: 'NOT_FOUND',
    P2003: 'BAD_REQUEST',
  };
  return map[code] ?? 'INTERNAL_SERVER_ERROR';
};
