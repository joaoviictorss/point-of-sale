import { getCurrentUserId } from "@/lib";
import { getUserOrganizationBySlug } from "@/lib/organization";
import { prisma } from "@/lib/prisma/client";
import type { CreateProductRequest } from "@/types/api/product";
import { createErrorResponse, createSuccessResponse } from "@/utils/http";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ organizationSlug: string }>;
  }
) {
  try {
    const userId = await getCurrentUserId();
    const body: CreateProductRequest = await req.json();
    const { organizationSlug } = await params;

    const {
      name,
      costPrice,
      salePrice,
      imageUrl,
      category,
      productType,
      stock,
      stockUnit,
      minStock,
      maxStock,
    } = body;

    if (!userId) {
      return createErrorResponse("Não autenticado", 401);
    }

    if (!name) {
      return createErrorResponse("Nome é obrigatório", 400);
    }

    if (!salePrice) {
      return createErrorResponse("Preço de venda é obrigatório", 400);
    }

    if (!organizationSlug) {
      return createErrorResponse("Slug da organização é obrigatório", 400);
    }

    const organization = await getUserOrganizationBySlug(organizationSlug);

    if (!organization) {
      return createErrorResponse(
        "Organização não encontrada ou você não tem permissão",
        404
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        costPrice,
        salePrice,
        imageUrl,
        category,
        productType,
        stock,
        stockUnit,
        minStock,
        maxStock,
        organizationSlug,
      },
    });

    return createSuccessResponse("Produto criado com sucesso", product, 201);
  } catch {
    return createErrorResponse("Internal error", 500);
  }
}

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: Promise<{ organizationSlug: string }>;
  }
) {
  try {
    const userId = await getCurrentUserId();
    const { organizationSlug } = await params;

    if (!userId) {
      return createErrorResponse("Não autenticado", 401);
    }

    if (!organizationSlug) {
      return createErrorResponse("Slug da organização é obrigatório", 400);
    }

    const organization = await getUserOrganizationBySlug(organizationSlug);

    if (!organization) {
      return createErrorResponse(
        "Organização não encontrada ou você não tem permissão",
        404
      );
    }

    const products = await prisma.product.findMany({
      where: {
        organizationSlug,
      },
    });

    return createSuccessResponse(
      "Produtos listados com sucesso",
      products,
      200
    );
  } catch {
    return createErrorResponse("Internal error", 500);
  }
}
