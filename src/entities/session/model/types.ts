export interface User {
  id: string
  email: string
  balance: string
  createdAt: string
}

export interface SessionState {
  accessToken: string | null
  user: User | null
  setSession: (accessToken: string, user: User) => void
  clearSession: () => void
}
