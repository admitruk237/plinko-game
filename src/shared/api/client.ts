interface ApiError {
  status: number;
  message: string | string[];
  error?: string;
}

export async function apiClient<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers: customHeaders, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customHeaders ?? {}),
  };

  const baseUrl = process.env.API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev';

  const response = await fetch(`${baseUrl}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 204) return undefined as T;

  const data = await response.json();

  if (!response.ok) {
    const err: ApiError = { status: response.status, message: data.message ?? 'Unknown error' };
    throw err;
  }

  return data as T;
}
