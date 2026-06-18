import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);
    const folder = formData.get('folder')?.toString() ?? 'documents';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      original_filename:
        result.original_filename,
      bytes: result.bytes,
      format: result.format,
      resource_type: result.resource_type,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}