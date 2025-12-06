'use server';

import { getCurrentUser, getCurrentUserId, isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma/client';
import type { User } from '@/types/user';

export async function getUserData(): Promise<User | null> {
  return await getCurrentUser();
}

export async function getUserId(): Promise<string | null> {
  return await getCurrentUserId();
}

export async function checkAuthentication(): Promise<boolean> {
  return await isAuthenticated();
}

export async function getUserProfile(): Promise<{
  user: User | null;
  hasOAuth: boolean;
  oAuthProviders: string[];
} | null> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return null;
    }

    const oAuthAccounts = await prisma.userOAuthAccount.findMany({
      where: { userId: user.id },
      select: { provider: true },
    });

    return {
      user,
      hasOAuth: oAuthAccounts.length > 0,
      oAuthProviders: oAuthAccounts.map((account) => account.provider),
    };
  } catch {
    return null;
  }
}
