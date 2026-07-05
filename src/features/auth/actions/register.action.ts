'use server';

import { authApi } from '@/shared/api/auth.api';
import { setAccessToken, setRefreshToken } from '@/shared/lib/session';
import { isApiError } from '@/shared/lib/api-error';
import { AUTH_ERRORS } from '../model/error-messages';
import type { RegisterFormValues } from '../model/schemas';
import type { User } from '@/entities/session';

export interface RegisterSuccess {
  ok: true;
  accessToken: string;
  user: User;
}

export interface RegisterError {
  ok: false;
  error: string;
  field?: 'email';
}

export type RegisterActionResult = RegisterSuccess | RegisterError;

export const registerAction = async (values: RegisterFormValues): Promise<RegisterActionResult> => {
  try {
    const { accessToken, refreshToken } = await authApi.register(values);
    await setRefreshToken(refreshToken);
    await setAccessToken(accessToken);
    const user = await authApi.getMe(accessToken);
    return { ok: true, accessToken, user };
  } catch (err: unknown) {
    if (isApiError(err)) {
      if (err.status === 409) {
        return { ok: false, error: AUTH_ERRORS.EMAIL_TAKEN, field: 'email' };
      }
      if (err.status === 429) {
        return { ok: false, error: AUTH_ERRORS.TOO_MANY_ATTEMPTS };
      }
      if (err.status === 400 && err.message) {
        // backend validation details (e.g. password rules) are user-readable
        const message = Array.isArray(err.message) ? err.message.join('. ') : err.message;
        return { ok: false, error: message };
      }
    }
    return { ok: false, error: AUTH_ERRORS.SERVER_ERROR };
  }
};
