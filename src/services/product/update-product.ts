import { httpApi } from "@/infra/http/httpApi";
import type {
  UpdateProductRequest,
  UpdateProductResponse,
} from "@/types/api/product";
import type { ApiErrorResponse } from "@/types/http";

export async function updateProduct(
  organizationSlug: string,
  productId: string,
  data: UpdateProductRequest
): Promise<UpdateProductResponse> {
  try {
    const response = await httpApi.patch<UpdateProductResponse>(
      `/organizations/${organizationSlug}/products/${productId}`,
      data
    );

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao atualizar produto"
    );
  }
}
