import { z } from 'zod';
import { PAGINATION } from '@/utils/constants';

const paymentMethodEnum = z.enum([
  'CASH',
  'CREDIT_CARD',
  'DEBIT_CARD',
  'PIX',
  'BANK_TRANSFER',
]);

export const saleItemSchema = z.object({
  productId: z.string().uuid('Produto inválido'),
  quantity: z.number().positive('Quantidade deve ser maior que 0'),
  discount: z
    .number()
    .int('Desconto deve ser informado em centavos')
    .min(0, 'Desconto deve ser maior ou igual a 0')
    .default(0),
});

export const salePaymentSchema = z.object({
  method: paymentMethodEnum,
  amount: z
    .number()
    .int('Valor deve ser informado em centavos')
    .positive('Valor do pagamento deve ser maior que 0'),
  installments: z
    .number()
    .int('Parcelas deve ser um número inteiro')
    .min(1, 'Parcelas deve ser no mínimo 1')
    .default(1),
});

export const createSaleSchema = z
  .object({
    items: z.array(saleItemSchema).min(1, 'Adicione ao menos um produto'),
    payments: z
      .array(salePaymentSchema)
      .min(1, 'Informe ao menos uma forma de pagamento'),
    discount: z
      .number()
      .int('Desconto deve ser informado em centavos')
      .min(0, 'Desconto deve ser maior ou igual a 0')
      .default(0),
    discountType: z.enum(['FIXED', 'PERCENT']).default('FIXED'),
    tax: z
      .number()
      .int('Imposto deve ser informado em centavos')
      .min(0, 'Imposto deve ser maior ou igual a 0')
      .default(0),
    customerId: z.string().uuid('Cliente inválido').optional(),
    sellerId: z.string().uuid('Vendedor inválido').optional(),
    customer: z
      .object({
        name: z
          .string()
          .min(1, 'Nome do cliente é obrigatório')
          .max(255, 'Nome deve ter no máximo 255 caracteres')
          .trim(),
        phone: z.string().max(40).trim().optional(),
        email: z.string().email('E-mail inválido').optional().or(z.literal('')),
      })
      .optional(),
    notes: z
      .string()
      .max(500, 'Observação deve ter no máximo 500 caracteres')
      .trim()
      .optional(),
  })
  .refine(
    (data) => data.discountType !== 'PERCENT' || data.discount <= 10_000,
    {
      message: 'Desconto percentual não pode ser maior que 100%',
      path: ['discount'],
    }
  );

export const getAllSalesFromOrganizationSchema = z.object({
  page: z.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  search: z.string().default(''),
  from: z.date().nullish(),
  to: z.date().nullish(),
});

export const getSaleByIdSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export type SaleItemInput = z.input<typeof saleItemSchema>;

export type SalePaymentInput = z.input<typeof salePaymentSchema>;

export type CreateSaleInput = z.input<typeof createSaleSchema>;

export type CreateSaleSchema = z.infer<typeof createSaleSchema>;

export type GetAllSalesFromOrganizationSchema = z.infer<
  typeof getAllSalesFromOrganizationSchema
>;

export type GetSaleByIdSchema = z.infer<typeof getSaleByIdSchema>;
