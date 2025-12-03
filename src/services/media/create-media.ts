import { httpApi } from "@/infra/http/httpApi";
import type {
  CreateMediaRequest,
  CreateMediaServiceResponse,
} from "@/types/api/media";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/http";

export async function createMedia(
  organizationSlug: string,
  data: CreateMediaRequest
): Promise<ApiSuccessResponse<CreateMediaServiceResponse>> {
  try {
    const formData = new FormData();
    formData.append("file", data.file);
    if (data.alt) {
      formData.append("alt", data.alt);
    }
    if (data.productId) {
      formData.append("productId", data.productId);
    }

    const response = await httpApi.post<
      ApiSuccessResponse<CreateMediaServiceResponse>
    >(`/organizations/${organizationSlug}/media`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao criar media"
    );
  }
}
