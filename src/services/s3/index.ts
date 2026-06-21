import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { env } from '@/env';

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadToS3(
  file: File,
  organizationSlug: string
): Promise<{ url: string; key: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const key = `pos/${organizationSlug}/${crypto.randomUUID()}-${file.name}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    },
  });

  await upload.done();

  const url = `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

  return { url, key };
}
