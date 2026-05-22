import { NextResponse } from 'next/server';
import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
} from '@/shared/lib/session';

const API_BASE = process.env.API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev';

export async function POST(): Promise<NextResponse> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (accessToken && refreshToken) {
    try {
      await fetch(`${API_BASE}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignore logout errors
    }
  }

  await deleteAccessToken();
  await deleteRefreshToken();

  return NextResponse.json(null, { status: 204 });
}
