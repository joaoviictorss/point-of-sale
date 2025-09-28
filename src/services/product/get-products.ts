import { httpApi } from "@/infra/http/httpApi";
import type { GetProductsResponse } from "@/types/api/product";
import type { ApiErrorResponse } from "@/types/http";

export async function getProducts(
  organizationSlug: string
): Promise<GetProductsResponse> {
  try {
    const response = await httpApi.get<GetProductsResponse>(
      `/organizations/${organizationSlug}/products`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao buscar produtos"
    );
  }
}
