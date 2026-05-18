'use client'

import { ReactNode } from 'react'
import { useSessionStore } from '@/entities/session/model/store'
import { User } from '@/entities/session/model/types'

interface Props {
  accessToken: string
  user: User
  children: ReactNode
}

export function SessionProvider({ accessToken, user, children }: Props) {
  const storeToken = useSessionStore((s) => s.accessToken)
  const setSession = useSessionStore((s) => s.setSession)

  if (storeToken !== accessToken) {
    setSession(accessToken, user)
  }

  return <>{children}</>
}
