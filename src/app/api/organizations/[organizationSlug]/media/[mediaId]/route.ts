import { v2 as cloudinary } from "cloudinary";
import { getCurrentUserId } from "@/lib";
import { getUserOrganizationBySlug } from "@/lib/organization";
import { prisma } from "@/lib/prisma/client";
import type { Media, UpdateMediaRequest } from "@/types/api/media";
import { createErrorResponse, createSuccessResponse } from "@/utils/http";

export async function GET(
  _req: Request,
  {
    params,
  }: {
    params: Promise<{ organizationSlug: string; mediaId: string }>;
  }
) {
  try {
    const userId = await getCurrentUserId();
    const { organizationSlug, mediaId } = await params;

    if (!userId) {
      return createErrorResponse("Não autenticado", 401);
    }

    if (!organizationSlug) {
      return createErrorResponse("Slug da organização é obrigatório", 400);
    }

    if (!mediaId) {
      return createErrorResponse("ID da media é obrigatório", 400);
    }

    const organization = await getUserOrganizationBySlug(organizationSlug);

    if (!organization) {
      return createErrorResponse(
        "Organização não encontrada ou você não tem permissão",
        404
      );
    }

    const media = await prisma.media.findFirst({
      where: {
        id: mediaId,
        organizationId: organization.id,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!media) {
      return createErrorResponse("Media não encontrada", 404);
    }

    const response: Media = {
      id: media.id,
      url: media.url,
      publicId: media.publicId,
      alt: media.alt || undefined,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      organizationId: media.organizationId,
      uploadedById: media.uploadedById || undefined,
      productId: media.productId || undefined,
      createdAt: media.createdAt.toISOString(),
      updatedAt: media.updatedAt.toISOString(),
    };

    return createSuccessResponse("Media encontrada", response, 200);
  } catch {
    return createErrorResponse("Erro interno do servidor", 500);
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ organizationSlug: string; mediaId: string }>;
  }
) {
  try {
    const userId = await getCurrentUserId();
    const body: UpdateMediaRequest = await req.json();
    const { organizationSlug, mediaId } = await params;

    if (!userId) {
      return createErrorResponse("Não autenticado", 401);
    }

    if (!organizationSlug) {
      return createErrorResponse("Slug da organização é obrigatório", 400);
    }

    if (!mediaId) {
      return createErrorResponse("ID da media é obrigatório", 400);
    }

    const organization = await getUserOrganizationBySlug(organizationSlug);

    if (!organization) {
      return createErrorResponse(
        "Organização não encontrada ou você não tem permissão",
        404
      );
    }

    const existingMedia = await prisma.media.findFirst({
      where: {
        id: mediaId,
        organizationId: organization.id,
      },
    });

    if (!existingMedia) {
      return createErrorResponse("Media não encontrada", 404);
    }

    // Validar productId se fornecido
    if (body.productId !== undefined && body.productId) {
      const product = await prisma.product.findFirst({
        where: {
          id: body.productId,
          organizationSlug,
        },
      });

      if (!product) {
        return createErrorResponse("Produto não encontrado", 404);
      }
    }

    const updateData: { alt?: string | null; productId?: string | null } = {};
    if (body.alt !== undefined) {
      updateData.alt = body.alt;
    }
    if (body.productId !== undefined) {
      updateData.productId = body.productId;
    }

    const updatedMedia = await prisma.media.update({
      where: { id: mediaId },
      data: updateData,
    });

    const response: Media = {
      id: updatedMedia.id,
      url: updatedMedia.url,
      publicId: updatedMedia.publicId,
      alt: updatedMedia.alt || undefined,
      mimeType: updatedMedia.mimeType,
      fileSize: updatedMedia.fileSize,
      organizationId: updatedMedia.organizationId,
      uploadedById: updatedMedia.uploadedById || undefined,
      productId: updatedMedia.productId || undefined,
      createdAt: updatedMedia.createdAt.toISOString(),
      updatedAt: updatedMedia.updatedAt.toISOString(),
    };

    return createSuccessResponse("Media atualizada com sucesso", response, 200);
  } catch {
    return createErrorResponse("Erro interno do servidor", 500);
  }
}

export async function DELETE(
  _req: Request,
  {
    params,
  }: {
    params: Promise<{ organizationSlug: string; mediaId: string }>;
  }
) {
  try {
    const userId = await getCurrentUserId();
    const { organizationSlug, mediaId } = await params;

    if (!userId) {
      return createErrorResponse("Não autenticado", 401);
    }

    if (!organizationSlug) {
      return createErrorResponse("Slug da organização é obrigatório", 400);
    }

    if (!mediaId) {
      return createErrorResponse("ID da media é obrigatório", 400);
    }

    const organization = await getUserOrganizationBySlug(organizationSlug);

    if (!organization) {
      return createErrorResponse(
        "Organização não encontrada ou você não tem permissão",
        404
      );
    }

    const existingMedia = await prisma.media.findFirst({
      where: {
        id: mediaId,
        organizationId: organization.id,
      },
    });

    if (!existingMedia) {
      return createErrorResponse("Media não encontrada", 404);
    }

    // Excluir do Cloudinary
    try {
      await cloudinary.uploader.destroy(existingMedia.publicId);
    } catch {
      // Log do erro mas continua com a exclusão do banco
      // O arquivo pode já ter sido excluído ou não existir mais
    }

    // Excluir do banco de dados
    await prisma.media.delete({
      where: { id: mediaId },
    });

    return createSuccessResponse("Media deletada com sucesso", null, 200);
  } catch {
    return createErrorResponse("Erro interno do servidor", 500);
  }
}
