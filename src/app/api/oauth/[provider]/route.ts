import { OAuthProvider } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { createSession } from "@/lib/session";
import { getOAuthClient } from "@/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const provider = OAuthProvider[rawProvider as keyof typeof OAuthProvider];

  if (typeof code !== "string" || typeof state !== "string") {
    redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Falha ao conectar, tente novamente."
      )}`
    );
  }

  const oAuthClient = getOAuthClient(provider);
  try {
    const oAuthUser = await oAuthClient.fetchUser(code, state, await cookies());
    const user = await connectUserToAccount(oAuthUser, provider);
    await createSession(user.id, true);
  } catch {
    redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Falha ao conectar, tente novamente."
      )}`
    );
  }

  redirect("/");
}

function connectUserToAccount(
  {
    id,
    email,
    name,
    imageUrl,
  }: { id: string; email: string; name: string; imageUrl?: string },
  provider: OAuthProvider
) {
  return prisma.$transaction(async (trx) => {
    let user = await trx.user.findFirst({
      where: { email },
      select: { id: true },
    });

    if (user == null) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          imageUrl,
        },
        select: { id: true },
      });
    }

    // Verifica se a conta OAuth já existe antes de criar
    const existingOAuthAccount = await prisma.userOAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: id,
        },
      },
    });

    if (!existingOAuthAccount) {
      await prisma.userOAuthAccount.create({
        data: {
          provider,
          providerAccountId: id,
          userId: user.id,
        },
      });
    }

    return user;
  });
}
