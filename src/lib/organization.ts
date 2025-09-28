import "server-only";

import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";

export async function getUserOrganizationBySlug(slug: string) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const organization = await prisma.organization.findFirst({
    where: {
      slug,
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      ownerId: true,
    },
  });

  return organization;
}

export async function hasAccessToOrganization(slug: string): Promise<boolean> {
  const organization = await getUserOrganizationBySlug(slug);
  return !!organization;
}
