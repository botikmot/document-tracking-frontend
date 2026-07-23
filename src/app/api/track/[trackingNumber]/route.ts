import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  const { trackingNumber } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/track/${trackingNumber}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { message: 'Tracking number not found' },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json(data);
}