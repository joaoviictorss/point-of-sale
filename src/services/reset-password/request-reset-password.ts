import { httpApi } from '@/infra/http/httpApi';
import type { ApiErrorResponse } from '@/types/http';
import type { RequesResetPasswordResponse } from '@/types/http/reset-password';

export async function requestPasswordReset(
  email: string
): Promise<RequesResetPasswordResponse> {
  try {
    const response: RequesResetPasswordResponse = await httpApi.post(
      '/auth/request-password-reset',
      { email }
    );

    return response;
  } catch (error) {
    throw new Error(
      (error as ApiErrorResponse).message || 'Erro na requisição'
    );
  }
}
