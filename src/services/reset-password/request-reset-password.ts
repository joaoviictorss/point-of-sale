import { httpApi } from "@/infra/http/httpApi";
import { ApiResponse } from "@/types/auth/data";

export async function requestPasswordReset(
  email: string
): Promise<ApiResponse> {
  try {
    const response = await httpApi.post<ApiResponse>("/auth/request-password-reset", {
      email,
    });

    const result: ApiResponse = response.data;

    if (!result.success) {
      throw new Error(result.message || result.error || "Erro na requisição");
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message || "Erro na requisição");
  }
}
