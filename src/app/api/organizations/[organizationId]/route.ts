import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib";
import { prisma } from "@/lib/prisma/client";
import { createErrorResponse } from "@/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    const body = await req.json();
    const { organizationId } = await params;

    const { name } = body;

    if (!userId) {
      return createErrorResponse("Não autenticado", 401);
    }

    if (!name) {
      return createErrorResponse("Nome é obrigatório", 400);
    }

    if (!organizationId) {
      return createErrorResponse("id da organização é obrigatório", 400);
    }

    const organization = await prisma.organization.updateMany({
      where: {
        id: organizationId,
        ownerId: userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(organization);
  } catch {
    return createErrorResponse("Internal error", 500);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    const { organizationId } = await params;

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 });
    }

    if (!organizationId) {
      return createErrorResponse("Id da loja é obrigatório", 400);
    }

    const organization = await prisma.organization.deleteMany({
      where: {
        id: organizationId,
        ownerId: userId,
      },
    });

    return NextResponse.json(organization);
  } catch {
    return createErrorResponse("Internal error", 500);
  }
}
