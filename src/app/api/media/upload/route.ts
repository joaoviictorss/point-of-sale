import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { uploadToCloudinary } from "@/services/cloudinary";
import { createErrorResponse } from "@/utils/http";

const uploadSchema = z.object({
  organizationId: z.string().uuid("ID da organização inválido"),
  alt: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return createErrorResponse("Não autorizado", 401);
    }

    // Extrair FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const organizationId = formData.get("organizationId") as string | null;
    const alt = formData.get("alt") as string | null;

    // Validar arquivo
    if (!(file instanceof File)) {
      return createErrorResponse("Arquivo é obrigatório", 400);
    }

    // Validar dados
    const validation = uploadSchema.safeParse({
      organizationId,
      alt: alt ?? undefined,
    });

    if (!validation.success) {
      return createErrorResponse(validation.error.errors[0].message, 400);
    }

    // Verificar se usuário pertence à organização
    const organization = await prisma.organization.findFirst({
      where: {
        id: validation.data.organizationId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: { id: true },
    });

    if (!organization) {
      return createErrorResponse(
        "Organização não encontrada ou sem permissão",
        403
      );
    }

    // Upload para Cloudinary
    const cloudinaryResult = await uploadToCloudinary(file);

    // Salvar no banco
    const media = await prisma.media.create({
      data: {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        alt: validation.data.alt,
        mimeType: file.type,
        fileSize: file.size,
        organizationId: validation.data.organizationId,
        uploadedById: userId,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch {
    return createErrorResponse("Erro ao fazer upload do arquivo", 500);
  }
}
