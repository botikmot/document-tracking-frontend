import { NextResponse } from 'next/server';

type UpdateDocumentStatusBody = {
  trackingNumber: string;
  status: string;
  remarks?: string;
};

export async function POST(
  request: Request,
) {
  try {
    /*
    |--------------------------------------------------------------------------
    | READ REQUEST BODY
    |--------------------------------------------------------------------------
    */

    const body =
      (await request.json()) as UpdateDocumentStatusBody;

    const {
      trackingNumber,
      status,
      remarks,
    } = body;

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      !trackingNumber ||
      !status
    ) {
      return NextResponse.json(
        {
          message:
            'Tracking number and status are required.',
        },
        {
          status: 400,
        },
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ENVIRONMENT VARIABLES
    |--------------------------------------------------------------------------
    */

    const apiUrl =
      process.env
        .NEXT_PUBLIC_API_URL;

    const apiKey =
      process.env
        .EDATS_PUBLIC_API_KEY;

    if (!apiUrl) {
      console.error(
        'NEXT_PUBLIC_API_URL is not configured.',
      );

      return NextResponse.json(
        {
          message:
            'API URL is not configured.',
        },
        {
          status: 500,
        },
      );
    }

    if (!apiKey) {
      console.error(
        'EDATS_PUBLIC_API_KEY is not configured.',
      );

      return NextResponse.json(
        {
          message:
            'API key is not configured.',
        },
        {
          status: 500,
        },
      );
    }

    /*
    |--------------------------------------------------------------------------
    | REQUEST TO EDATS BACKEND
    |--------------------------------------------------------------------------
    */

    const response =
      await fetch(
        `${apiUrl}/public/documents/status`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            'x-api-key':
              apiKey,
          },

          body: JSON.stringify({
            trackingNumber:
              trackingNumber.trim(),

            status:
              status
                .trim()
                .toUpperCase(),

            remarks:
              remarks?.trim() ||
              undefined,
          }),

          cache: 'no-store',
        },
      );

    /*
    |--------------------------------------------------------------------------
    | READ BACKEND RESPONSE
    |--------------------------------------------------------------------------
    */

    const data =
      await response.json();

    /*
    |--------------------------------------------------------------------------
    | FORWARD BACKEND ERROR
    |--------------------------------------------------------------------------
    */

    if (!response.ok) {
      return NextResponse.json(
        data,
        {
          status:
            response.status,
        },
      );
    }

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    return NextResponse.json(
      data,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      'Update document status error:',
      error,
    );

    return NextResponse.json(
      {
        message:
          'Failed to update document status.',
      },
      {
        status: 500,
      },
    );
  }
}