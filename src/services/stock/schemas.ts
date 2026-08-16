import { z } from 'zod';
import { PAGINATION } from '@/utils/constants';

const movementTypeEnum = z.enum(['PURCHASE', 'ADJUSTMENT']);

export const createStockMovementSchema = z
  .object({
    productId: z.string().uuid('Produto inválido'),
    type: movementTypeEnum,
    quantity: z
      .number()
      .refine((value) => value !== 0, 'Quantidade não pode ser zero'),
    reason: z
      .string()
      .max(255, 'Motivo deve ter no máximo 255 caracteres')
      .trim()
      .optional(),
    unitCost: z
      .number()
      .int('Custo deve ser informado em centavos')
      .min(0, 'Custo deve ser maior ou igual a 0')
      .optional(),
  })
  .refine((data) => data.type !== 'PURCHASE' || data.quantity > 0, {
    message: 'Entrada de compra deve ter quantidade positiva',
    path: ['quantity'],
  })
  .refine(
    (data) => data.type !== 'ADJUSTMENT' || Boolean(data.reason?.trim()),
    { message: 'Informe o motivo do ajuste', path: ['reason'] }
  );

export const getAllStockMovementsFromOrganizationSchema = z.object({
  page: z.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  productId: z.string().uuid('Produto inválido').optional(),
  type: z.enum(['SALE', 'RETURN', 'ADJUSTMENT', 'PURCHASE']).optional(),
});

export type CreateStockMovementInput = z.input<
  typeof createStockMovementSchema
>;

export type CreateStockMovementSchema = z.infer<
  typeof createStockMovementSchema
>;

export type GetAllStockMovementsFromOrganizationSchema = z.infer<
  typeof getAllStockMovementsFromOrganizationSchema
>;
