import { httpApi } from "@/infra/http/httpApi";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/http";

export type ExempleResponse = ApiSuccessResponse<{
  exampleResponse: string;
}>;

export async function ExempleService(data: string): Promise<ExempleResponse> {
  try {
    const response = await httpApi.post<ExempleResponse>("/route-example", {
      data,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro na requisição"
    );
  }
}
