import { httpApi } from "@/infra/http/httpApi";
import type { GetMediaResponse } from "@/types/api/media";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/http";

export async function getMedia(
  organizationSlug: string,
  mediaId: string
): Promise<ApiSuccessResponse<GetMediaResponse>> {
  try {
    const response = await httpApi.get<ApiSuccessResponse<GetMediaResponse>>(
      `/organizations/${organizationSlug}/media/${mediaId}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao buscar media"
    );
  }
}
