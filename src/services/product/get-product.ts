import { httpApi } from "@/infra/http/httpApi";
import type { GetProductResponse } from "@/types/api/product";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/http";

export async function getProduct(
  organizationSlug: string,
  productId: string
): Promise<ApiSuccessResponse<GetProductResponse>> {
  try {
    const response = await httpApi.get<ApiSuccessResponse<GetProductResponse>>(
      `/organizations/${organizationSlug}/products/${productId}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao buscar produto"
    );
  }
}
