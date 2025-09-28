import { httpApi } from "@/infra/http/httpApi";
import type { GetOrganizationsResponse } from "@/types/api";
import type { ApiErrorResponse } from "@/types/http";

export async function getOrganizations(): Promise<GetOrganizationsResponse[]> {
  try {
    const response =
      await httpApi.get<GetOrganizationsResponse[]>("/organizations");

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || "Erro ao buscar organizações"
    );
  }
}
