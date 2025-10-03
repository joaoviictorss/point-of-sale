import { httpApi } from "@/infra/http/httpApi";
import type { DeleteProductResponse } from "@/types/api/product";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/http";

export async function deleteProduct(
  organizationSlug: string,
  productId: string
): Promise<ApiSuccessResponse<DeleteProductResponse>> {
  try {
    const response = await httpApi.delete<
      ApiSuccessResponse<DeleteProductResponse>
    >(`/organizations/${organizationSlug}/products/${productId}`);

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao deletar produto"
    );
  }
}
