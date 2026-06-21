export type UploadedMedia = {
  id: string;
  url: string;
  alt: string | null;
  mimeType: string;
  fileSize: number;
};

export async function uploadMedia(
  file: File,
  organizationSlug: string,
  alt?: string
): Promise<UploadedMedia> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("organizationSlug", organizationSlug);
  if (alt) formData.append("alt", alt);

  const response = await fetch("/api/media/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Erro ao fazer upload");
  }

  return response.json();
}
