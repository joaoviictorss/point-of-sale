import type { Media, ProductType, StockUnit } from "@prisma/client";

export interface CreateProductRequest {
  code: string;
  name: string;
  costPrice?: number;
  salePrice?: number;
  media: string[];
  category: string;
  productType: ProductType;
  stock: number;
  stockUnit: StockUnit;
  minStock: number;
  maxStock: number;
}

export type CreateProductResponse = {
  id: string;
  code: string;
  name: string;
  costPrice: number;
  salePrice: number;
  media: Media[];
  category: string;
  productType: ProductType;
  createdAt: string;
  updatedAt: string;
};

export interface UpdateProductRequest {
  code?: string;
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
  code: string;
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
  media: Media[];
  createdAt: string;
  updatedAt: string;
};

export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  totalDocs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  count: number;
}

export interface GetProductsResponse {
  docs: Product[];
  pagination: PaginationInfo;
}

export type GetProductResponse = Product;
export type UpdateProductResponse = Product;
export type DeleteProductResponse = null;
