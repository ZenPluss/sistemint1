import * as Minio from 'minio';

const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
const port = parseInt(process.env.MINIO_PORT || '9000');
const accessKey = process.env.MINIO_ROOT_USER || 'admin';
const secretKey = process.env.MINIO_ROOT_PASSWORD || 'password123';

export const minioClient = new Minio.Client({
  endPoint: endpoint,
  port: port,
  useSSL: false,
  accessKey,
  secretKey,
});

export const BUCKET_NAME = process.env.MINIO_DEFAULT_BUCKET || 'erp-storage';

// Pastikan bucket ada saat pertama kali dipakai
export async function ensureBucketExists(): Promise<void> {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
  }
}
