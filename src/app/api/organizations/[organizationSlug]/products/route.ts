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
  req: Request,
  {
    params,
  }: {
    params: Promise<{ organizationSlug: string }>;
  }
) {
  try {
    const userId = await getCurrentUserId();
    const { organizationSlug } = await params;
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const limit = Math.min(
      Number.parseInt(searchParams.get("limit") || "20", 10),
      100
    );
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";
    const category = searchParams.get("category");
    const productType = searchParams.get("productType");
    const search = searchParams.get("search");

    if (!userId) {
      return createErrorResponse("Não autenticado", 401);
    }

    if (!organizationSlug) {
      return createErrorResponse("Slug da organização é obrigatório", 400);
    }

    const organization = await getUserOrganizationBySlug(organizationSlug);
    if (!organization) {
      return createErrorResponse("Organização não encontrada", 404);
    }

    const where: Record<string, unknown> = {
      organizationSlug,
      ...(category && { category }),
      ...(productType && { productType }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
      ...(cursor && { id: { [order === "asc" ? "gt" : "lt"]: cursor } }),
    };

    const products = await prisma.product.findMany({
      where,
      take: limit + 1,
      orderBy: {
        id: order,
      },
    });

    const hasNextPage = products.length > limit;
    const items = hasNextPage ? products.slice(0, -1) : products;

    const nextCursor = hasNextPage ? items.at(-1)?.id : null;
    const prevCursor = items.length > 0 ? items[0]?.id : null;

    const hasPrevPage = !!cursor;

    const total = await prisma.product.count({ where: { organizationSlug } });

    const paginationInfo = {
      hasNextPage,
      hasPrevPage,
      nextCursor,
      prevCursor,
      limit,
      count: items.length,
      totalDocs: total,
    };

    return createSuccessResponse(
      "Produtos listados com sucesso",
      {
        docs: items,
        pagination: paginationInfo,
      },
      200
    );
  } catch {
    return createErrorResponse("Internal error", 500);
  }
}
