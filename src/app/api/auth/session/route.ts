import { NextResponse } from 'next/server'
import { authApi } from '@/shared/api/auth.api'
import { getRefreshToken, setRefreshToken, deleteRefreshToken } from '@/shared/lib/session'
import type { User } from '@/entities/session/model/types'

interface SessionData {
  accessToken: string
  user: User
}

export async function GET(): Promise<NextResponse<SessionData> | NextResponse<null>> {
  const refreshToken = await getRefreshToken()

  if (!refreshToken) {
    return NextResponse.json(null, { status: 401 })
  }

  try {
    const refreshed = await authApi.refresh(refreshToken)
    await setRefreshToken(refreshed.refreshToken)
    const user = await authApi.getMe(refreshed.accessToken)
    return NextResponse.json({ accessToken: refreshed.accessToken, user })
  } catch {
    await deleteRefreshToken()
    return NextResponse.json(null, { status: 401 })
  }
}
