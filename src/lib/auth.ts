import 'server-only';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma/client';
import { decrypt } from '@/lib/session';
import type { User } from '@/types/user';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    if (!session?.userId || typeof session.userId !== 'string') {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    if (!session?.userId || typeof session.userId !== 'string') {
      return null;
    }

    return session.userId;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const userId = await getCurrentUserId();
  return !!userId;
}
