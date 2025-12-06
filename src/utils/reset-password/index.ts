import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma/client';

export async function getRecentResetRequests(email: string, minutesAgo = 5) {
  const timeAgo = new Date(Date.now() - minutesAgo * 60 * 1000);

  return await prisma.resetPasswordToken.findMany({
    where: {
      email,
      createdAt: {
        gte: timeAgo,
      },
    },
  });
}

export async function createResetToken(data: {
  email: string;
  expiresAt: Date;
  used: boolean;
  ipAddress?: string;
}) {
  return await prisma.resetPasswordToken.create({
    data: {
      email: data.email,
      expiresAt: data.expiresAt,
      used: data.used,
      ipAddress: data.ipAddress,
    },
  });
}

export async function findResetToken(id: string) {
  const token = await prisma.resetPasswordToken.findFirst({
    where: {
      id,
    },
  });
  return token;
}

export async function updateResetPasswordToken(
  id: string,
  data: {
    used?: boolean;
  }
) {
  return await prisma.resetPasswordToken.update({
    where: { id },
    data: {
      ...data,
      ...(data.used && { usedAt: new Date() }),
    },
  });
}

export const verifyToken = (token: string, hashedToken: string) => {
  return bcrypt.compareSync(token, hashedToken);
};

export const isTokenExpired = (expirationDate: Date) => {
  return new Date() > new Date(expirationDate);
};
