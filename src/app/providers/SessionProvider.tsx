'use client'

import { ReactNode, useRef } from 'react'
import { useSessionStore } from '@/entities/session'
import type { User } from '@/entities/session'

interface Props {
  accessToken: string
  user: User
  children: ReactNode
}

export const SessionProvider = ({ accessToken, user, children }: Props) => {
  const initialized = useRef(false)
  if (!initialized.current) {
    useSessionStore.setState({ accessToken, user })
    initialized.current = true
  }

  return <>{children}</>
}
