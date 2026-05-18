import { NextRequest, NextResponse } from 'next/server';
import { minioClient, BUCKET_NAME } from '@/lib/minio';

export const runtime = 'nodejs';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const objectName = decodeURIComponent(filename);

    await minioClient.removeObject(BUCKET_NAME, objectName);

    return NextResponse.json({ success: true, message: 'File berhasil dihapus' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus file';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const objectName = decodeURIComponent(filename);

    // Presigned URL berlaku 1 jam
    const url = await minioClient.presignedGetObject(BUCKET_NAME, objectName, 3600);

    return NextResponse.json({ success: true, url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membuat URL';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
