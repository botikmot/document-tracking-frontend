import cloudinary from '@/lib/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID required' },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: 'raw',
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}