import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib";
import { prisma } from "@/lib/prisma/client";
import type {
  CreateOrganizationRequest,
  CreateOrganizationResponse,
} from "@/types/api";
import { createErrorResponse, slugify } from "@/utils";

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    const body: CreateOrganizationRequest = await req.json();

    const { name } = body;

    if (!userId) {
      return createErrorResponse("Sem autorização", 401);
    }

    if (!name) {
      return createErrorResponse("Nome é obrigatorio", 400);
    }

    const slug = slugify(name);

    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        ownerId: userId,
      },
    });

    const response: CreateOrganizationResponse = {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      ownerId: organization.ownerId,
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
    };

    return NextResponse.json(response);
  } catch {
    return createErrorResponse("Internal error", 500);
  }
}
