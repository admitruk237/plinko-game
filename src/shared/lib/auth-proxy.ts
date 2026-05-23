import 'server-only';
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/shared/lib/session';
import { authApi } from '@/shared/api/auth.api';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    return Date.now() >= (payload.exp as number) * 1000;
  } catch {
    return true;
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  const accessToken = await getAccessToken();

  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await deleteAccessToken();
    return null;
  }

  try {
    const refreshed = await authApi.refresh(refreshToken);
    await setAccessToken(refreshed.accessToken);
    await setRefreshToken(refreshed.refreshToken);
    return refreshed.accessToken;
  } catch (err) {
    const status = (err as { status?: number })?.status;
    if (status === 401 || status === 403) {
      await deleteAccessToken();
      await deleteRefreshToken();
    }
    return null;
  }
}
