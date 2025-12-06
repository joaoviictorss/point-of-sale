import type { ApiSuccessResponse } from '@/types/http';

export type ResetPasswordResponse = ApiSuccessResponse<{
  userId: string;
}>;

export type RequesResetPasswordResponse = ApiSuccessResponse<null>;
