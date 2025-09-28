import { httpApi } from "@/infra/http/httpApi";
import type {
  CreateProductRequest,
  CreateProductResponse,
} from "@/types/api/product";
import type { ApiErrorResponse } from "@/types/http";

export async function createProduct(
  organizationSlug: string,
  data: CreateProductRequest
): Promise<CreateProductResponse> {
  try {
    const response = await httpApi.post<CreateProductResponse>(
      `/organizations/${organizationSlug}/products`,
      data
    );

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao criar produto"
    );
  }
}
