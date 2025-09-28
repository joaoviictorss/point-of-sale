import type { ProductType, StockUnit } from "@prisma/client";

export interface CreateProductRequest {
  name: string;
  costPrice?: number;
  salePrice?: number;
  imageUrl: string;
  category: string;
  productType: ProductType;
  stock: number;
  stockUnit: StockUnit;
  minStock: number;
  maxStock: number;
}

export type CreateProductResponse = {
  id: string;
  name: string;
  costPrice: number;
  salePrice: number;
  imageUrl: string;
  category: string;
  productType: ProductType;
  createdAt: string;
  updatedAt: string;
};

export interface UpdateProductRequest {
  name?: string;
  costPrice?: number;
  salePrice?: number;
  imageUrl?: string;
  category?: string;
  productType?: ProductType;
  stock?: number;
  stockUnit?: StockUnit;
  minStock?: number;
  maxStock?: number;
}

export type Product = {
  id: string;
  name: string;
  costPrice: number;
  salePrice: number;
  imageUrl: string | null;
  category: string | null;
  productType: ProductType;
  stock: number;
  stockUnit: StockUnit;
  minStock: number | null;
  maxStock: number | null;
  organizationSlug: string;
  createdAt: string;
  updatedAt: string;
};

export type GetProductsResponse = Product[];
export type GetProductResponse = Product;
export type UpdateProductResponse = Product;
export type DeleteProductResponse = null;
