import { httpApi } from "@/infra/http/httpApi";
import type { GetProductsResponse } from "@/types/api/product";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/http";

export interface GetProductsParams {
  cursor?: string;
  limit?: number;
  order?: "asc" | "desc";
  category?: string;
  productType?: string;
  search?: string;
  includeTotal?: boolean;
}

export async function getProducts(
  organizationSlug: string,
  params?: GetProductsParams
): Promise<ApiSuccessResponse<GetProductsResponse>> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.cursor) {
      searchParams.set("cursor", params.cursor);
    }
    if (params?.limit) {
      searchParams.set("limit", params.limit.toString());
    }
    if (params?.order) {
      searchParams.set("order", params.order);
    }
    if (params?.category) {
      searchParams.set("category", params.category);
    }
    if (params?.productType) {
      searchParams.set("productType", params.productType);
    }
    if (params?.search) {
      searchParams.set("search", params.search);
    }
    if (params?.includeTotal) {
      searchParams.set("includeTotal", "true");
    }

    const queryString = searchParams.toString();
    const url = `/organizations/${organizationSlug}/products${queryString ? `?${queryString}` : ""}`;

    const response =
      await httpApi.get<ApiSuccessResponse<GetProductsResponse>>(url);

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao buscar produtos"
    );
  }
}
