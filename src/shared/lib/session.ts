import 'server-only';
import { cookies } from 'next/headers';

const REFRESH_KEY = 'refreshToken';
const ACCESS_KEY = 'accessToken';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export const setRefreshToken = async (token: string): Promise<void> => {
  try {
    const store = await cookies();
    store.set(REFRESH_KEY, token, COOKIE_OPTIONS);
  } catch (error) {
    console.warn('Could not set refresh token cookie (likely read-only context):', error);
  }
};

export const getRefreshToken = async (): Promise<string | undefined> => {
  const store = await cookies();
  return store.get(REFRESH_KEY)?.value;
};

export const deleteRefreshToken = async (): Promise<void> => {
  try {
    const store = await cookies();
    store.set(REFRESH_KEY, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  } catch (error) {
    console.warn('Could not delete refresh token cookie (likely read-only context):', error);
  }
};

export const setAccessToken = async (token: string): Promise<void> => {
  try {
    const store = await cookies();
    store.set(ACCESS_KEY, token, COOKIE_OPTIONS);
  } catch (error) {
    console.warn('Could not set access token cookie (likely read-only context):', error);
  }
};

export const getAccessToken = async (): Promise<string | undefined> => {
  const store = await cookies();
  return store.get(ACCESS_KEY)?.value;
};

export const deleteAccessToken = async (): Promise<void> => {
  try {
    const store = await cookies();
    store.set(ACCESS_KEY, '', { ...COOKIE_OPTIONS, maxAge: 0 });
  } catch (error) {
    console.warn('Could not delete access token cookie (likely read-only context):', error);
  }
};
