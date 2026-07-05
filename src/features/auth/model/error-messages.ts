export const AUTH_ERRORS = {
  INVALID_CREDENTIALS:
    "Incorrect email or password. Double-check both and try again — or sign up if you don't have an account yet.",
  EMAIL_TAKEN: 'This email is already registered. Try signing in instead.',
  TOO_MANY_ATTEMPTS: 'Too many attempts. Please wait a minute and try again.',
  SERVER_ERROR: 'Something went wrong on our side. Please try again in a moment.',
} as const;
