import { z } from 'zod';
import { PAGINATION } from '@/utils/constants';

export const sellerFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .trim(),
  code: z
    .string()
    .max(20, 'Código deve ter no máximo 20 caracteres')
    .trim()
    .transform((value) => value.toUpperCase())
    .optional(),
  active: z.boolean().default(true),
});

export const getAllSellersFromOrganizationSchema = z.object({
  page: z.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  search: z.string().default(''),
  status: z.enum(['active', 'inactive', 'all']).default('all'),
});

export const getSellerByIdSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const updateSellerSchema = z.object({
  id: z.string().uuid('ID inválido'),
  ...sellerFormSchema.shape,
});

export const deleteSellerSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export type SellerFormInput = z.input<typeof sellerFormSchema>;

export type SellerFormSchema = z.infer<typeof sellerFormSchema>;

export type GetAllSellersFromOrganizationSchema = z.infer<
  typeof getAllSellersFromOrganizationSchema
>;

export type GetSellerByIdSchema = z.infer<typeof getSellerByIdSchema>;

export type UpdateSellerSchema = z.infer<typeof updateSellerSchema>;

export type DeleteSellerSchema = z.infer<typeof deleteSellerSchema>;
