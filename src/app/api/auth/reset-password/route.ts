import type { NextResponse } from "next/server";

import { resetPasswordFormSchema } from "@/lib/validations/auth/signUp";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/types/http/index.ts";
import type { ResetPasswordResponse } from "@/types/http/reset-password";
import {
  createErrorResponse,
  createSuccessResponse,
  findResetToken,
  findUserByEmail,
  hasheAndSaltPassword,
  isTokenExpired,
  updateResetPasswordToken,
  updateUserPassword,
} from "@/utils";

export async function POST(
  request: Request
): Promise<
  NextResponse<ApiSuccessResponse<ResetPasswordResponse> | ApiErrorResponse>
> {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token) {
      return createErrorResponse("Token é obrigatório", 400);
    }

    if (!password) {
      return createErrorResponse("Nova senha é obrigatória", 400);
    }

    const passwordValidation = resetPasswordFormSchema.safeParse({
      password,
    });

    if (!passwordValidation.success) {
      return createErrorResponse(
        "Senha não atende aos critérios de segurança",
        400
      );
    }

    const resetToken = await findResetToken(token);

    if (!resetToken) {
      return createErrorResponse("Token não encontrado", 400);
    }

    if (resetToken.used) {
      return createErrorResponse("Token já utilizado", 400);
    }

    if (isTokenExpired(resetToken.expiresAt)) {
      return createErrorResponse("Token expirado", 400);
    }

    const user = await findUserByEmail(resetToken.email);

    if (!user) {
      return createErrorResponse("Usuário não encontrado", 404);
    }

    const hashedPassword = await hasheAndSaltPassword(password);
    await updateUserPassword(user.id, hashedPassword);

    await updateResetPasswordToken(resetToken.id, { used: true });

    return createSuccessResponse("Senha redefinida com sucesso", null, 200);
  } catch {
    return createErrorResponse(
      "Erro interno do servidor. Tente novamente mais tarde",
      500
    );
  }
}
