import 'server-only'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  deleteAccessToken,
  deleteRefreshToken,
} from '@/shared/lib/session'
import { authApi } from '@/shared/api/auth.api'

/**
 * Gets a valid access token, attempting refresh if the current one is expired.
 * Returns null if no valid token can be obtained.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const accessToken = await getAccessToken()
  const refreshToken = await getRefreshToken()

  // Try the current access token against the backend
  if (accessToken) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev'}/api/v1/users/me`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (res.ok) return accessToken
    } catch {
      // token is invalid or expired — fall through to refresh
    }
  }

  // Try to refresh
  if (!refreshToken) {
    await deleteAccessToken()
    return null
  }

  try {
    const refreshed = await authApi.refresh(refreshToken)
    await setAccessToken(refreshed.accessToken)
    await setRefreshToken(refreshed.refreshToken)
    return refreshed.accessToken
  } catch {
    await deleteAccessToken()
    await deleteRefreshToken()
    return null
  }
}
