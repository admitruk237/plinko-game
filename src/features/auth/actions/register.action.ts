'use server'

import { authApi } from '@/shared/api/auth.api'
import { setRefreshToken, setAccessToken } from '@/shared/lib/session'
import { isApiError } from '@/shared/lib/api-error'
import { RegisterFormValues } from '../model/schemas'
import { User } from '@/entities/session/model/types'

export interface RegisterSuccess {
  ok: true
  accessToken: string
  user: User
}

export interface RegisterError {
  ok: false
  error: string
  field?: 'email'
}

export type RegisterActionResult = RegisterSuccess | RegisterError

export async function registerAction(values: RegisterFormValues): Promise<RegisterActionResult> {
  try {
    const { accessToken, refreshToken } = await authApi.register(values)
    await setRefreshToken(refreshToken)
    await setAccessToken(accessToken)
    const user = await authApi.getMe(accessToken)
    return { ok: true, accessToken, user }
  } catch (err: unknown) {
    if (isApiError(err) && err.status === 409) {
      return { ok: false, error: 'Email already registered', field: 'email' }
    }
    return { ok: false, error: 'Server error, try again' }
  }
}
