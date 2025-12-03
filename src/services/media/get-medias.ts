import { httpApi } from "@/infra/http/httpApi";
import type { MediaListResponse } from "@/types/api/media";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/http";

export interface GetMediasParams {
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  mimeType?: string;
  search?: string;
  productId?: string;
}

export async function getMedias(
  organizationSlug: string,
  params?: GetMediasParams
): Promise<ApiSuccessResponse<MediaListResponse>> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.page) {
      searchParams.set("page", params.page.toString());
    }
    if (params?.limit) {
      searchParams.set("limit", params.limit.toString());
    }
    if (params?.order) {
      searchParams.set("order", params.order);
    }
    if (params?.mimeType) {
      searchParams.set("mimeType", params.mimeType);
    }
    if (params?.search) {
      searchParams.set("search", params.search);
    }
    if (params?.productId) {
      searchParams.set("productId", params.productId);
    }

    const queryString = searchParams.toString();
    const url = `/organizations/${organizationSlug}/media${queryString ? `?${queryString}` : ""}`;

    const response =
      await httpApi.get<ApiSuccessResponse<MediaListResponse>>(url);

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao buscar medias"
    );
  }
}
