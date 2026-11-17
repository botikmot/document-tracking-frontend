import { NextResponse } from "next/server";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

type OfficeMapping = {
  label: string;
  officeCode: string | null;
  enabled: boolean;
};

type DocumentRoutingBody = {
  trackingNumber: string;
  receivingOffice: string;
  remarks?: string;
};

/*
|--------------------------------------------------------------------------
| CENTRALIZED OFFICE MAPPING
|--------------------------------------------------------------------------
|
| officeCode = actual Office.officeCode in eDATS.
| Keep null until verified against the live database.
|
*/

const OFFICE_MAPPINGS: Record<string, OfficeMapping> = {
  REGIONAL_OFFICE: {
    label: "REGIONAL OFFICE",
    officeCode: null,
    enabled: false,
  },

  RO_ARD: {
    label: "Office of the ARD Management",
    officeCode: "RO-ARD",
    enabled: true,
  },

  RO_ASD: {
    label: "RO ASD",
    officeCode: null,
    enabled: false,
  },

  RO_SMD: {
    label: "RO SMD",
    officeCode: null,
    enabled: false,
  },

  RO_MS: {
    label: "RO MS",
    officeCode: null,
    enabled: false,
  },

  RO_TS: {
    label: "RO TS",
    officeCode: null,
    enabled: false,
  },

  RO_ED: {
    label: "RO ED",
    officeCode: null,
    enabled: false,
  },

  RO_FD: {
    label: "RO FD",
    officeCode: null,
    enabled: false,
  },

  RO_LD: {
    label: "RO LD",
    officeCode: null,
    enabled: false,
  },

  RO_LPDD: {
    label: "RO LPDD",
    officeCode: null,
    enabled: false,
  },

  RO_NGP: {
    label: "RO NGP",
    officeCode: null,
    enabled: false,
  },

  RO_PMD: {
    label: "RO PMD",
    officeCode: null,
    enabled: false,
  },
};

/*
|--------------------------------------------------------------------------
| AUTHENTICATION
|--------------------------------------------------------------------------
*/

function authorize(request: Request) {
  const expectedKey = process.env.EDATS_EXTERNAL_INTEGRATION_KEY;

  if (!expectedKey) {
    return {
      authorized: false,
      status: 500,
      message: "External integration key is not configured.",
    };
  }

  const suppliedKey = request.headers.get("x-integration-key");

  if (suppliedKey !== expectedKey) {
    return {
      authorized: false,
      status: 401,
      message: "Unauthorized integration request.",
    };
  }

  return {
    authorized: true,
    status: 200,
    message: "Authorized.",
  };
}

/*
|--------------------------------------------------------------------------
| NORMALIZE OFFICE INPUT
|--------------------------------------------------------------------------
*/

function normalizeOffice(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

/*
|--------------------------------------------------------------------------
| GET - AVAILABLE ROUTING OFFICES
|--------------------------------------------------------------------------
*/

export async function GET(request: Request) {
  try {
    const auth = authorize(request);

    if (!auth.authorized) {
      return NextResponse.json(
        { message: auth.message },
        { status: auth.status },
      );
    }

    const offices = Object.entries(OFFICE_MAPPINGS).map(
      ([externalCode, mapping]) => ({
        externalCode,
        officeName: mapping.label,
        available: mapping.enabled && Boolean(mapping.officeCode),
        mappingStatus:
          mapping.enabled && mapping.officeCode
            ? "ACTIVE"
            : "PENDING_CONFIGURATION",
      }),
    );

    return NextResponse.json(
      {
        success: true,
        message: "Routing offices retrieved successfully.",
        data: offices,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get routing offices error:", error);

    return NextResponse.json(
      { message: "Failed to retrieve routing offices." },
      { status: 500 },
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST - CREATE DOCUMENT ROUTING
|--------------------------------------------------------------------------
*/

export async function POST(request: Request) {
  try {
    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATION
    |--------------------------------------------------------------------------
    */

    const auth = authorize(request);

    if (!auth.authorized) {
      return NextResponse.json(
        { message: auth.message },
        { status: auth.status },
      );
    }

    /*
    |--------------------------------------------------------------------------
    | READ REQUEST BODY
    |--------------------------------------------------------------------------
    */

    const body = (await request
      .json()
      .catch(() => null)) as DocumentRoutingBody | null;

    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    const trackingNumber = body.trackingNumber?.trim();

    const receivingOffice = body.receivingOffice?.trim();

    if (!trackingNumber || !receivingOffice) {
      return NextResponse.json(
        {
          message: "Tracking number and receiving office are required.",
        },
        { status: 400 },
      );
    }

    /*
    |--------------------------------------------------------------------------
    | RESOLVE OFFICE MAPPING
    |--------------------------------------------------------------------------
    */

    const externalOfficeCode = normalizeOffice(receivingOffice);

    const mapping = OFFICE_MAPPINGS[externalOfficeCode];

    if (!mapping) {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_RECEIVING_OFFICE",
          message: "Unknown receiving office.",
        },
        { status: 400 },
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK MAPPING AVAILABILITY
    |--------------------------------------------------------------------------
    */

    if (!mapping.enabled || !mapping.officeCode) {
      return NextResponse.json(
        {
          success: false,
          code: "OFFICE_MAPPING_NOT_CONFIGURED",
          message: "The receiving office has not yet been configured in eDATS.",
          receivingOffice: mapping.label,
        },
        { status: 409 },
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ENVIRONMENT VARIABLES
    |--------------------------------------------------------------------------
    */

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const apiKey = process.env.EDATS_PUBLIC_API_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { message: "API configuration is incomplete." },
        { status: 500 },
      );
    }

    /*
    |--------------------------------------------------------------------------
    | REQUEST TO EDATS BACKEND
    |--------------------------------------------------------------------------
    */

    const response = await fetch(
      `${apiUrl.replace(/\/+$/, "")}/public/documents/routing`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },

        body: JSON.stringify({
          trackingNumber,
          receivingOfficeCode: mapping.officeCode,
          remarks: body.remarks?.trim() || undefined,
        }),

        cache: "no-store",
      },
    );

    /*
    |--------------------------------------------------------------------------
    | READ BACKEND RESPONSE
    |--------------------------------------------------------------------------
    */

    const data = await response.json().catch(() => ({
      message: "Invalid response from eDATS backend.",
    }));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Document routing API error:", error);

    return NextResponse.json(
      {
        message: "Failed to process document routing request.",
      },
      { status: 500 },
    );
  }
}
