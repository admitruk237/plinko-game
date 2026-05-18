import { apiClient } from './client'
import { User } from '@/entities/session/model/types'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export interface RegisterResponse {
  user: Pick<User, 'id' | 'email'>
  accessToken: string
  refreshToken: string
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

export const authApi = {
  login: (dto: LoginDto) =>
    apiClient<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  register: (dto: RegisterDto) =>
    apiClient<RegisterResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  logout: (token: string) =>
    apiClient<void>('/api/v1/auth/logout', {
      method: 'POST',
      token,
    }),

  refresh: (refreshToken: string) =>
    apiClient<RefreshResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  getMe: (token: string) =>
    apiClient<User>('/api/v1/users/me', { token }),
}
