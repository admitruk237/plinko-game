# Layer: app

**Responsibility:** Next.js App Router — routing, global layout, SSR store initialization, BFF API proxy.

---

## Structure

```
src/app/
  layout.tsx              ← root layout: SSR session + settings hydration
  page.tsx                ← redirect / → /game
  not-found.tsx           ← 404 page
  globals.css             ← Tailwind imports, OKLCH CSS variables
  game/page.tsx           ← protected game page
  history/page.tsx        ← protected bet history page
  progress/page.tsx       ← protected progress page (BottomNav shell)
  profile/page.tsx        ← protected profile page (BottomNav shell)
  login/page.tsx          ← public login page
  register/page.tsx       ← public register page
  providers/
    QueryProvider.tsx     ← @tanstack/react-query client
    SessionProvider.tsx   ← initializes useSessionStore from SSR data
    SettingsProvider.tsx  ← initializes useSettingsStore from cookies
  api/
    auth/session/route.ts ← GET: token validation + refresh
    auth/logout/route.ts  ← POST: backend logout (best-effort) + clear cookies → 204
    bets/route.ts         ← GET (list) + POST (place bet)
    bets/[id]/route.ts    ← GET: bet details
    game/config/route.ts  ← GET: game config (rows, risks, payoutTables)
    seeds/route.ts        ← GET (active seed) + POST (client/rotate)
    seeds/[id]/route.ts   ← GET: revealed seed details
    user/me/route.ts      ← GET: current user
```

---

## SSR Hydration Flow (layout.tsx)

On every request `RootLayout` (Server Component):

1. Reads `accessToken` + `refreshToken` cookies
2. If at least one exists → fetches `/api/auth/session`
3. Gets `{ accessToken, user }` or null
4. Reads `soundEffectsEnabled` + `animationsEnabled` from cookies
5. Renders providers in order: `QueryProvider → SettingsProvider → SessionProvider → children`

`SessionProvider` and `SettingsProvider` are Client Components that initialize Zustand stores via render-phase sync (`if (initialized.current == null)`).

---

## API Routes (BFF)

All protected route handlers use `getValidAccessToken()` from `@/shared/lib/auth-proxy`.

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/session` | GET | Validate access token, refresh if expired |
| `/api/auth/logout` | POST | Notify backend logout (best-effort, errors ignored), delete accessToken + refreshToken cookies, respond 204 |
| `/api/bets` | GET | Bet list with cursor-based pagination |
| `/api/bets` | POST | Place a bet |
| `/api/bets/[id]` | GET | Bet details |
| `/api/game/config` | GET | Config: rows[], risks[], minBet, maxBet, payoutTables |
| `/api/seeds` | GET | Active seed |
| `/api/seeds` | POST | `?action=client` update clientSeed, `?action=rotate` rotate |
| `/api/seeds/[id]` | GET | Revealed seed details |
| `/api/user/me` | GET | Current user (proxied via getValidAccessToken) |

---

## Middleware (src/proxy.ts)

Checks `refreshToken` cookie only (no backend call):
- Protected routes (`/game`, `/history`) without refreshToken → redirect `/login`
- Public routes (`/login`, `/register`) with refreshToken → redirect `/game`

---

## Dependencies

`app` → `pages` → `widgets` → `features` → `entities` → `shared`
