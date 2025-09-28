import { getCurrentUserId } from "@/lib";
import { getUserOrganizationBySlug } from "@/lib/organization";
import { prisma } from "@/lib/prisma/client";
import { createErrorResponse, createSuccessResponse } from "@/utils/http";

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: Promise<{ organizationSlug: string; productId: string }>;
  }
) {
  try {
    const userId = await getCurrentUserId();
    const { organizationSlug, productId } = await params;

    if (!userId) {
      return createErrorResponse("Não autenticado", 401);
    }

    if (!organizationSlug) {
      return createErrorResponse("Slug da organização é obrigatório", 400);
    }

    if (!productId) {
      return createErrorResponse("ID do produto é obrigatório", 400);
    }

    const organization = await getUserOrganizationBySlug(organizationSlug);

    if (!organization) {
      return createErrorResponse(
        "Organização não encontrada ou você não tem permissão",
        404
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        organizationSlug,
      },
    });

    if (!product) {
      return createErrorResponse("Produto não encontrado", 404);
    }

    return createSuccessResponse("Produto encontrado", product, 200);
  } catch {
    return createErrorResponse("Internal error", 500);
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ organizationSlug: string; productId: string }>;
  }
) {
  try {
    const userId = await getCurrentUserId();
    const body = await req.json();
    const { organizationSlug, productId } = await params;

    if (!userId) {
      return createErrorResponse("Não autenticado", 401);
    }

    if (!organizationSlug) {
      return createErrorResponse("Slug da organização é obrigatório", 400);
    }

    if (!productId) {
      return createErrorResponse("ID do produto é obrigatório", 400);
    }

    const organization = await getUserOrganizationBySlug(organizationSlug);

    if (!organization) {
      return createErrorResponse(
        "Organização não encontrada ou você não tem permissão",
        404
      );
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        organizationSlug,
      },
    });

    if (!existingProduct) {
      return createErrorResponse("Produto não encontrado", 404);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...body,
      },
    });

    return createSuccessResponse(
      "Produto atualizado com sucesso",
      updatedProduct,
      200
    );
  } catch {
    return createErrorResponse("Internal error", 500);
  }
}

export async function DELETE(
  _req: Request,
  {
    params,
  }: {
    params: Promise<{ organizationSlug: string; productId: string }>;
  }
) {
  try {
    const userId = await getCurrentUserId();
    const { organizationSlug, productId } = await params;

    if (!userId) {
      return createErrorResponse("Não autenticado", 401);
    }

    if (!organizationSlug) {
      return createErrorResponse("Slug da organização é obrigatório", 400);
    }

    if (!productId) {
      return createErrorResponse("ID do produto é obrigatório", 400);
    }

    const organization = await getUserOrganizationBySlug(organizationSlug);

    if (!organization) {
      return createErrorResponse(
        "Organização não encontrada ou você não tem permissão",
        404
      );
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        organizationSlug,
      },
    });

    if (!existingProduct) {
      return createErrorResponse("Produto não encontrado", 404);
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return createSuccessResponse("Produto deletado com sucesso", null, 200);
  } catch {
    return createErrorResponse("Internal error", 500);
  }
}
