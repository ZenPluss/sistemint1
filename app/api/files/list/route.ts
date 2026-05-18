import { NextResponse } from 'next/server';
import { minioClient, BUCKET_NAME, ensureBucketExists } from '@/lib/minio';
import { BucketItem } from 'minio';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await ensureBucketExists();

    const objects: BucketItem[] = await new Promise((resolve, reject) => {
      const items: BucketItem[] = [];
      const stream = minioClient.listObjectsV2(BUCKET_NAME, '', true);
      stream.on('data', (obj) => items.push(obj));
      stream.on('end', () => resolve(items));
      stream.on('error', reject);
    });

    // Buat presigned URL untuk setiap file (berlaku 1 jam)
    const filesWithUrls = await Promise.all(
      objects.map(async (obj) => {
        const url = await minioClient.presignedGetObject(BUCKET_NAME, obj.name!, 3600);
        return {
          name: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
          url,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: filesWithUrls.sort(
        (a, b) => new Date(b.lastModified!).getTime() - new Date(a.lastModified!).getTime()
      ),
      total: filesWithUrls.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengambil daftar file';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
