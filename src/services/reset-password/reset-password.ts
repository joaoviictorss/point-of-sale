import { httpApi } from "@/infra/http/httpApi";
import { ApiResponse } from "@/types/auth/data";

export async function resetPassword(
  password: string,
  token: string
): Promise<ApiResponse> {
  try {
    const response = await httpApi.post<ApiResponse>("/auth/reset-password", {
      token,
      password,
    });

    const result: ApiResponse = response.data;

    if (!result.success) {
      throw new Error(result.message || result.error || "Erro na requisição");
    }

    return result;
  } catch (error: any) {
    throw new Error(
      error.response?.data || error.message || "Erro na requisição"
    );
  }
}
