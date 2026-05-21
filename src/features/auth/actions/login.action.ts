'use server';

import { authApi } from '@/shared/api/auth.api';
import { setAccessToken, setRefreshToken } from '@/shared/lib/session';
import { isApiError } from '@/shared/lib/api-error';
import type { LoginFormValues } from '../model/schemas';
import type { User } from '@/entities/session/model/types';

export interface LoginSuccess {
  ok: true;
  accessToken: string;
  user: User;
}

export interface LoginError {
  ok: false;
  error: string;
}

export type LoginActionResult = LoginSuccess | LoginError;

export async function loginAction(values: LoginFormValues): Promise<LoginActionResult> {
  try {
    const { accessToken, refreshToken } = await authApi.login(values);
    await setRefreshToken(refreshToken);
    await setAccessToken(accessToken);
    const user = await authApi.getMe(accessToken);
    return { ok: true, accessToken, user };
  } catch (err: unknown) {
    if (isApiError(err) && err.status === 401) {
      return { ok: false, error: 'Invalid credentials' };
    }
    return { ok: false, error: 'Server error, try again' };
  }
}
