import 'server-only'
import { cookies } from 'next/headers'

const KEY = 'refreshToken'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

export async function setRefreshToken(token: string): Promise<void> {
  try {
    const store = await cookies()
    store.set(KEY, token, COOKIE_OPTIONS)
  } catch (error) {
    console.warn('Could not set refresh token cookie (likely read-only context):', error)
  }
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(KEY)?.value
}

export async function deleteRefreshToken(): Promise<void> {
  try {
    const store = await cookies()
    store.delete(KEY)
  } catch (error) {
    console.warn('Could not delete refresh token cookie (likely read-only context):', error)
  }
}
