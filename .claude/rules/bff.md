---
paths: ["src/app/api/**"]
---
# BFF Layer (src/app/api/)

Next.js Route Handlers that act as a proxy between the browser and the external backend (`API_BASE_URL`, default: `https://plinko-be-stanish.fly.dev`).

## Auth token flow

Tokens live in **httpOnly cookies** — the browser never touches them directly:
- `accessToken` cookie — short-lived JWT
- `refreshToken` cookie — long-lived, used to get a new access token

All server-side cookie ops go through `@/shared/lib/session.ts` (server-only).

## Pattern for protected routes

Every protected route handler MUST use `getValidAccessToken()` from `@/shared/lib/auth-proxy`:

```ts
import { getValidAccessToken } from '@/shared/lib/auth-proxy'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = await getValidAccessToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const response = await fetch(`${API_BASE}/api/v1/...`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await response.json()
  if (!response.ok) return NextResponse.json(data, { status: response.status })
  return NextResponse.json(data)
}
```

`getValidAccessToken()` internally: validates access token → tries refresh if expired → returns null if both fail.

## Rules

- NEVER read cookies manually in route handlers — always use `session.ts` helpers or `getValidAccessToken()`
- NEVER expose raw backend errors — proxy the status code and body as-is
- Public routes (login, register, session) handle tokens themselves — do NOT call `getValidAccessToken()` there
- `API_BASE` constant must come from `process.env.API_BASE_URL` (server-only, NO `NEXT_PUBLIC_` prefix) with fallback to the fly.dev URL
- Route handlers are **Server Components context** — no Zustand, no client hooks
