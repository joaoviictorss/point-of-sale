import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

export async function uploadToCloudinary(
  file: File
): Promise<UploadApiResponse> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "pos",
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload falhou, resultado indefinido"));
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });
}
