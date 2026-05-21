'use server';

import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
} from '@/shared/lib/session';
import { authApi } from '@/shared/api/auth.api';

export async function logoutAction(): Promise<void> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (accessToken && refreshToken) {
    try {
      await authApi.logout(accessToken, refreshToken);
    } catch {}
  }
  await deleteRefreshToken();
  await deleteAccessToken();
}
