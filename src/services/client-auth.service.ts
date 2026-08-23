import { clientApi } from '@/lib/client-api';

import type {
  ClientLoginDto,
  ClientLoginResponse,
  ClientUser,
} from '@/types/client-auth';

export interface VerifyEmailResponse {
  message: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function verifyClientEmail(
  token: string,
): Promise<VerifyEmailResponse> {
  if (!API_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not configured.',
    );
  }

  const response = await fetch(
    `${API_URL}/client-auth/verify-email`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        token,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Unable to verify email address.',
    );
  }

  return data;
}

export const clientAuthService = {
  async login(
    dto: ClientLoginDto,
  ) {
    return clientApi<ClientLoginResponse>(
      '/client-auth/login',
      {
        method: 'POST',
        body: JSON.stringify(dto),
      },
    );
  },

  async me(
    token: string,
  ) {
    return clientApi<ClientUser>(
      '/client-auth/me',
      {
        method: 'GET',
        token,
      },
    );
  },
};