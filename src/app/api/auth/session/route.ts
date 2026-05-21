import { NextResponse } from 'next/server';
import { authApi } from '@/shared/api/auth.api';
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/shared/lib/session';
import type { User } from '@/entities/session/model/types';

interface SessionData {
  accessToken: string;
  user: User;
}

export async function GET(): Promise<NextResponse<SessionData> | NextResponse<null>> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (accessToken) {
    try {
      const user = await authApi.getMe(accessToken);
      return NextResponse.json({ accessToken, user });
    } catch {}
  }

  if (!refreshToken) {
    await deleteAccessToken();
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const refreshed = await authApi.refresh(refreshToken);
    await setRefreshToken(refreshed.refreshToken);
    await setAccessToken(refreshed.accessToken);
    const user = await authApi.getMe(refreshed.accessToken);
    return NextResponse.json({ accessToken: refreshed.accessToken, user });
  } catch {
    await deleteRefreshToken();
    await deleteAccessToken();
    return NextResponse.json(null, { status: 401 });
  }
}
