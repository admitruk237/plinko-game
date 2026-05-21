interface ApiErrorShape {
  status: number;
  message?: string | string[];
}

export function isApiError(err: unknown): err is ApiErrorShape {
  return typeof err === 'object' && err !== null && 'status' in err;
}
