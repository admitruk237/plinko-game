---
paths: ["src/features/auth/**", "src/entities/session/**", "src/app/api/auth/**"]
---
# Auth Domain

Spans three layers: `entities/session` (state), `features/auth` (UI + actions), `app/api/auth` (BFF endpoints).

## Session state — `entities/session`

`useSessionStore` holds `{ accessToken, user }` in memory (no persist — intentional):
- `setSession(accessToken, user)` — called after successful login/register/session hydration
- `clearSession()` — called on logout

## Hydration flow

On every page load `SessionProvider` (`app/providers/SessionProvider.tsx`) calls `GET /api/auth/session`:
1. Route handler reads `accessToken` cookie → validates against backend
2. If expired → uses `refreshToken` cookie to refresh → sets new cookies
3. Returns `{ accessToken, user }` or `null` (401)
4. `SessionProvider` calls `setSession` or `clearSession` accordingly

## Auth actions (Server Actions)

Located in `features/auth/actions/`:
- `login.action.ts` — POST credentials → receives tokens → sets cookies via `session.ts` helpers → calls `setSession`
- `register.action.ts` — same flow
- `logout.action.ts` — clears both cookies → calls `clearSession` → redirects to `/login`

## Middleware

`src/proxy.ts` (Next.js middleware) guards routes using only the **refreshToken cookie** (lightweight check — no backend call):
- Protected routes (`/game`, `/history`): redirect to `/login` if no refreshToken
- Public routes (`/login`, `/register`): redirect to `/game` if refreshToken exists

## Rules

- Do NOT read `accessToken` from the store on the server — use `getValidAccessToken()` from `auth-proxy.ts`
- The store is client-only; SSR/RSC must never depend on it
- Auth forms use `react-hook-form` + zod schemas from `features/auth/model/schemas.ts`
- Errors from Server Actions are returned as `{ error: string }` — not thrown
