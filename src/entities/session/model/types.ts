import type { UserDto as User } from '@/shared/api/types'

export type { User }

export interface SessionState {
  accessToken: string | null
  user: User | null
  setSession: (accessToken: string, user: User) => void
  clearSession: () => void
}
