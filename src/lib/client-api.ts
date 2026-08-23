const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function clientApi<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    token,
    headers,
    body,
    ...requestOptions
  } = options;

  const isFormData =
    typeof FormData !== 'undefined' &&
    body instanceof FormData;

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...requestOptions,

      body,

      headers: {
        ...(!isFormData
          ? {
              'Content-Type':
                'application/json',
            }
          : {}),

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),

        ...headers,
      },
    },
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const message =
      Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message ||
          data?.error ||
          'Something went wrong.';

    throw new Error(message);
  }

  return data as T;
}