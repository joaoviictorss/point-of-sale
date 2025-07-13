import type { NextResponse } from "next/server";

import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/types/http/index.ts";
import {
  createErrorResponse,
  createResetToken,
  createSuccessResponse,
  findUserByEmail,
  getRecentResetRequests,
  requestPasswordReset,
} from "@/utils";

export interface RateLimitMeta {
  retryAfter: number; // em minutos
  remainingAttempts?: number;
}

const requestTracker = new Map<string, number[]>();

function isRateLimited(
  ip: string,
  email: string
): {
  isLimited: boolean;
  remainingAttempts: number;
  retryAfter: number;
} {
  const key = `${ip}-${email}`;
  const now = Date.now();
  const requests = requestTracker.get(key) || [];
  const maxAttempts = 3;
  const windowMs = 5 * 60 * 1000; // 5 minutos

  const recentRequests = requests.filter(
    (time: number) => now - time < windowMs
  );

  if (recentRequests.length >= maxAttempts) {
    return {
      isLimited: true,
      remainingAttempts: 0,
      retryAfter: 5, // minutos
    };
  }

  recentRequests.push(now);
  requestTracker.set(key, recentRequests);

  return {
    isLimited: false,
    remainingAttempts: maxAttempts - recentRequests.length,
    retryAfter: 0,
  };
}

export async function POST(
  request: Request
): Promise<NextResponse<ApiSuccessResponse<null> | ApiErrorResponse>> {
  try {
    const body: { email: string } = await request.json();
    const { email } = body;
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (!email || typeof email !== "string") {
      return createErrorResponse("Email é obrigatório e deve ser válido", 400);
    }

    const rateLimitCheck = isRateLimited(ip, email);
    if (rateLimitCheck.isLimited) {
      return createErrorResponse(
        "Muitas tentativas. Aguarde e tente novamente mais tarde.",
        429
      );
    }

    const recentRequests = await getRecentResetRequests(email, 5);
    if (recentRequests.length > 0) {
      return createErrorResponse(
        "Pedido de redefinição de senha já foi enviado recentemente. Aguarde e tente novamente mais tarde.",
        429
      );
    }

    const user = await findUserByEmail(email);

    if (user) {
      const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 min

      const resetToken = await createResetToken({
        email,
        expiresAt: expirationTime,
        used: false,
        ipAddress: ip,
      });

      await requestPasswordReset(email, resetToken.id);
    }

    return createSuccessResponse(
      "Se o email estiver cadastrado, você receberá um link de recuperação.",
      null
    );
  } catch {
    return createErrorResponse(
      "Erro interno do servidor. Tente novamente mais tarde.",
      500
    );
  }
}
