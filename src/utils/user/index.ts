import { comparePassword } from "@/utils/password";
import { prisma } from "@/lib/prisma/client";

export const findUserByCredentials = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return null;
  }
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};

export async function updateUserPassword(
  userId: string,
  hashedPassword: string
) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      updatedAt: new Date(),
    },
  });
}
