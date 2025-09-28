import { prisma } from "@/lib/prisma/client";

export const findOrganizationByUserId = async (userId: string) => {
  // Buscar se é owner de alguma organização
  const ownedOrganization = await prisma.organization.findFirst({
    where: { ownerId: userId },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (ownedOrganization) {
    return ownedOrganization;
  }

  // Se não é owner, buscar se é member
  const membership = await prisma.member.findFirst({
    where: { userId },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return membership?.organization || null;
};
