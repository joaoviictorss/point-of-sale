import { httpApi } from "@/infra/http/httpApi";
import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
} from "@/types/api";
import type { ApiErrorResponse } from "@/types/http";

export async function createOrganization(
  data: CreateOrganizationRequest
): Promise<CreateOrganizationResponse> {
  try {
    const response = await httpApi.post<CreateOrganizationResponse>(
      "/organizations",
      data
    );

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao criar organização"
    );
  }
}
