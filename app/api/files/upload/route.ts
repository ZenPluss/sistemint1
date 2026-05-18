import { NextRequest, NextResponse } from 'next/server';
import { minioClient, BUCKET_NAME, ensureBucketExists } from '@/lib/minio';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validasi ukuran file (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File terlalu besar (max 50MB)' }, { status: 400 });
    }

    await ensureBucketExists();

    const buffer = Buffer.from(await file.arrayBuffer());
    // Tambahkan timestamp untuk menghindari nama duplikat
    const objectName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    await minioClient.putObject(BUCKET_NAME, objectName, buffer, buffer.length, {
      'Content-Type': file.type || 'application/octet-stream',
    });

    return NextResponse.json({
      success: true,
      message: 'File berhasil diupload',
      data: {
        objectName,
        originalName: file.name,
        size: file.size,
        contentType: file.type,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload gagal';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
