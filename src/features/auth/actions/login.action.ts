'use server';

import { authApi } from '@/shared/api/auth.api';
import { setAccessToken, setRefreshToken } from '@/shared/lib/session';
import { isApiError } from '@/shared/lib/api-error';
import { AUTH_ERRORS } from '../model/error-messages';
import type { LoginFormValues } from '../model/schemas';
import type { User } from '@/entities/session';

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

export const loginAction = async (values: LoginFormValues): Promise<LoginActionResult> => {
  try {
    const { accessToken, refreshToken } = await authApi.login(values);
    await setRefreshToken(refreshToken);
    await setAccessToken(accessToken);
    const user = await authApi.getMe(accessToken);
    return { ok: true, accessToken, user };
  } catch (err: unknown) {
    if (isApiError(err)) {
      if (err.status === 401) {
        return { ok: false, error: AUTH_ERRORS.INVALID_CREDENTIALS };
      }
      if (err.status === 429) {
        return { ok: false, error: AUTH_ERRORS.TOO_MANY_ATTEMPTS };
      }
      if (err.status === 400 && err.message) {
        // backend validation details (e.g. "email must be an email") are user-readable
        const message = Array.isArray(err.message) ? err.message.join('. ') : err.message;
        return { ok: false, error: message };
      }
    }
    return { ok: false, error: AUTH_ERRORS.SERVER_ERROR };
  }
};
