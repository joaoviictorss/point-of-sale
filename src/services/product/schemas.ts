import { z } from "zod";
import { PAGINATION } from "@/utils/constants";

export const productFormSchema = z.object({
  code: z
    .string()
    .min(1, "Código é obrigatório")
    .max(50, "Código deve ter no máximo 50 caracteres")
    .trim(),
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(255, "Nome deve ter no máximo 255 caracteres")
    .trim(),
  costPrice: z
    .number()
    .min(0, "Preço de custo deve ser maior ou igual a 0")
    .default(0),
  salePrice: z.number().min(0.01, "Preço de venda deve ser maior que 0"),
  category: z
    .string()
    .min(1, "Categoria é obrigatória")
    .max(100, "Categoria deve ter no máximo 100 caracteres")
    .trim()
    .optional(),
  productType: z.enum(["UNIT", "WEIGHT", "VOLUME"], {
    required_error: "Tipo de produto é obrigatório",
  }),
  stock: z.number().min(0, "Estoque deve ser maior ou igual a 0").default(0),
  stockUnit: z.enum(["UNITS", "GRAMS", "KILOGRAMS", "LITERS", "MILLILITERS"], {
    required_error: "Unidade de estoque é obrigatória",
  }),
  minStock: z
    .number()
    .min(0, "Estoque mínimo deve ser maior ou igual a 0")
    .optional(),
  maxStock: z
    .number()
    .min(0, "Estoque máximo deve ser maior ou igual a 0")
    .optional(),
  medias: z.array(z.string().uuid("ID de mídia inválido")).default([]),
});

export const getAllProductsFromOrganizationSchema = z.object({
  page: z.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  search: z.string().default(""),
});

export const getProductByIdSchema = z.object({
  id: z.string().uuid("ID inválido"),
});

export const deleteProductSchema = z.object({
  id: z.string().uuid("ID inválido"),
});

export type ProductFormInput = z.input<typeof productFormSchema>;

export type ProductFormSchema = z.infer<typeof productFormSchema>;

export type GetAllProductsFromOrganizationSchema = z.infer<
  typeof getAllProductsFromOrganizationSchema
>;

export type GetProductByIdSchema = z.infer<typeof getProductByIdSchema>;

export type DeleteProductSchema = z.infer<typeof deleteProductSchema>;
