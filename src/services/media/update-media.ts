import { httpApi } from "@/infra/http/httpApi";
import type {
  UpdateMediaRequest,
  UpdateMediaResponse,
} from "@/types/api/media";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/http";

export async function updateMedia(
  organizationSlug: string,
  mediaId: string,
  data: UpdateMediaRequest
): Promise<ApiSuccessResponse<UpdateMediaResponse>> {
  try {
    const response = await httpApi.patch<
      ApiSuccessResponse<UpdateMediaResponse>
    >(`/organizations/${organizationSlug}/media/${mediaId}`, data);

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao atualizar media"
    );
  }
}
