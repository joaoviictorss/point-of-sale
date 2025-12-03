import { getCurrentUserId } from "@/lib";
import { getUserOrganizationBySlug } from "@/lib/organization";
import { prisma } from "@/lib/prisma/client";
import { uploadToCloudinary } from "@/services/cloudinary";
import type { Media, MediaListResponse } from "@/types/api/media";
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

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const alt = formData.get("alt") as string | null;
    const productId = formData.get("productId") as string | null;

    if (!file) {
      return createErrorResponse("Arquivo é obrigatório", 400);
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return createErrorResponse("Tipo de arquivo não suportado", 400);
    }

    // Validar tamanho do arquivo (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return createErrorResponse("Arquivo muito grande. Máximo 10MB", 400);
    }

    // Upload para Cloudinary
    const cloudinaryResult = await uploadToCloudinary(file);

    // Validar productId se fornecido
    if (productId) {
      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          organizationSlug,
        },
      });

      if (!product) {
        return createErrorResponse("Produto não encontrado", 404);
      }
    }

    // Salvar no banco de dados
    const media = await prisma.media.create({
      data: {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        alt: alt || null,
        mimeType: file.type,
        fileSize: file.size,
        organizationId: organization.id,
        uploadedById: userId,
        productId: productId ?? null,
      },
    });

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

    return createSuccessResponse("Media criada com sucesso", response, 201);
  } catch {
    return createErrorResponse("Erro interno do servidor", 500);
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

    const page = Math.max(
      Number.parseInt(searchParams.get("page") || "1", 10),
      1
    );
    const limit = Math.min(
      Number.parseInt(searchParams.get("limit") || "20", 10),
      100
    );
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";
    const mimeType = searchParams.get("mimeType");
    const search = searchParams.get("search");
    const productId = searchParams.get("productId");

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
      organizationId: organization.id,
      ...(mimeType && { mimeType: { contains: mimeType } }),
      ...(search && { alt: { contains: search, mode: "insensitive" } }),
      ...(productId && { productId }),
    };

    const total = await prisma.media.count({ where });
    const offset = (page - 1) * limit;

    const medias = await prisma.media.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: order,
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

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const paginationInfo = {
      page,
      limit,
      totalPages,
      totalDocs: total,
      hasNextPage,
      hasPrevPage,
      count: medias.length,
    };

    const docs: Media[] = medias.map((media) => ({
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
    }));

    const response: MediaListResponse = {
      docs,
      pagination: paginationInfo,
    };

    return createSuccessResponse("Medias listadas com sucesso", response, 200);
  } catch {
    return createErrorResponse("Erro interno do servidor", 500);
  }
}
