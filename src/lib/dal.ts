import { cache } from "react";
import { prisma } from "./prisma/client";
import { verifySession } from "./session";

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch {
    return null;
  }
});
