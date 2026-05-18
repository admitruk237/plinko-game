'use server'

import { authApi } from '@/shared/api/auth.api'
import { deleteRefreshToken } from '@/shared/lib/session'

export async function logoutAction(accessToken: string): Promise<void> {
  try {
    await authApi.logout(accessToken)
  } catch {
    // ignore — видаляємо cookie незалежно від відповіді backend
  }
  await deleteRefreshToken()
}
