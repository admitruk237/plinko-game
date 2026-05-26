import { z } from 'zod';

export const NICKNAME_MIN = 3;
export const NICKNAME_MAX = 20;

export const nicknameSchema = z
  .string()
  .trim()
  .min(NICKNAME_MIN, `Nickname must be at least ${NICKNAME_MIN} characters`)
  .max(NICKNAME_MAX, `Nickname must be at most ${NICKNAME_MAX} characters`)
  .regex(/^[A-Za-z0-9_]+$/, 'Only letters, numbers and underscore allowed');
