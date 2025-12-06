import { httpApi } from '@/infra/http/httpApi';
import type { ApiErrorResponse } from '@/types/http';
import type { ResetPasswordResponse } from '@/types/http/reset-password';

export async function resetPassword(
  password: string,
  token: string
): Promise<ResetPasswordResponse> {
  try {
    const response = await httpApi.post<ResetPasswordResponse>(
      '/auth/reset-password',
      { token, password }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || 'Erro na requisição'
    );
  }
}
