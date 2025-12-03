import { httpApi } from "@/infra/http/httpApi";
import type { DeleteMediaServiceResponse } from "@/types/api/media";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/http";

export async function deleteMedia(
  organizationSlug: string,
  mediaId: string
): Promise<ApiSuccessResponse<DeleteMediaServiceResponse>> {
  try {
    const response = await httpApi.delete<
      ApiSuccessResponse<DeleteMediaServiceResponse>
    >(`/organizations/${organizationSlug}/media/${mediaId}`);

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao deletar media"
    );
  }
}
