import { httpApi } from "@/infra/http/httpApi";
import type { DeleteProductResponse } from "@/types/api/product";
import type { ApiErrorResponse } from "@/types/http";

export async function deleteProduct(
  organizationSlug: string,
  productId: string
): Promise<DeleteProductResponse> {
  try {
    const response = await httpApi.delete<DeleteProductResponse>(
      `/organizations/${organizationSlug}/products/${productId}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao deletar produto"
    );
  }
}
