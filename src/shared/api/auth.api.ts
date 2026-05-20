import { apiClient } from './client'
import type {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  RegisterResponseDto,
  RefreshResponseDto,
  UserDto,
} from './types'

export const authApi = {
  login: (dto: LoginDto) =>
    apiClient<AuthResponseDto>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  register: (dto: RegisterDto) =>
    apiClient<RegisterResponseDto>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  logout: (token: string, refreshToken: string) =>
    apiClient<void>('/api/v1/auth/logout', {
      method: 'POST',
      token,
      body: JSON.stringify({ refreshToken }),
    }),

  refresh: (refreshToken: string) =>
    apiClient<RefreshResponseDto>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  getMe: (token: string) =>
    apiClient<UserDto>('/api/v1/users/me', { token }),
}
