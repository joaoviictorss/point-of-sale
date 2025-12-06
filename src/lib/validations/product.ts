import { z } from 'zod';

export const ProductFormSchema = z.object({
  code: z
    .string()
    .min(1, 'Código é obrigatório')
    .max(50, 'Código deve ter no máximo 50 caracteres')
    .trim(),
  name: z
    .string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .trim(),
  costPrice: z
    .number()
    .min(0, 'Preço de custo deve ser maior ou igual a 0')
    .optional()
    .or(z.literal(0)),
  salePrice: z.number().min(0.01, 'Preço de venda deve ser maior que 0'),
  imageUrl: z.string().default(''),
  category: z
    .string()
    .min(1, 'Categoria é obrigatória')
    .max(100, 'Categoria deve ter no máximo 100 caracteres')
    .trim(),
  productType: z.enum(['UNIT', 'WEIGHT', 'VOLUME'], {
    required_error: 'Tipo de produto é obrigatório',
  }),
  stock: z.number().min(0, 'Estoque deve ser maior ou igual a 0').default(0),
  stockUnit: z.enum(['UNITS', 'GRAMS', 'KILOGRAMS', 'LITERS', 'MILLILITERS'], {
    required_error: 'Unidade de estoque é obrigatória',
  }),
  minStock: z
    .number()
    .min(0, 'Estoque mínimo deve ser maior ou igual a 0')
    .default(0),
  maxStock: z
    .number()
    .min(0, 'Estoque máximo deve ser maior ou igual a 0')
    .default(0),
  media: z
    .array(
      z.union([
        z.object({
          id: z.string(),
          url: z.string(),
          publicId: z.string(),
          alt: z.string().optional(),
        }),
        z.object({
          id: z.string(),
          file: z.instanceof(File),
          preview: z.string().optional(),
        }),
      ])
    )
    .default([]),
});

export type ProductFormSchema = z.infer<typeof ProductFormSchema>;
