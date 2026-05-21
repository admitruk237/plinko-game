# Layer: app

**Відповідальність:** Next.js App Router — роутинг, глобальний layout, SSR-ініціалізація стору, API-проксі (BFF).

---

## Структура

```
src/app/
  layout.tsx              ← root layout: SSR session + settings hydration
  page.tsx                ← redirect / → /game
  not-found.tsx           ← 404 сторінка
  globals.css             ← Tailwind imports, OKLCH CSS variables
  game/page.tsx           ← захищена сторінка гри
  history/page.tsx        ← захищена сторінка історії ставок
  login/page.tsx          ← публічна сторінка логіну
  register/page.tsx       ← публічна сторінка реєстрації
  providers/
    QueryProvider.tsx     ← @tanstack/react-query client
    SessionProvider.tsx   ← ініціалізує useSessionStore з SSR-даних
    SettingsProvider.tsx  ← ініціалізує useSettingsStore з cookie
  api/
    auth/session/route.ts ← GET: валідація + refresh токенів
    auth/logout/route.ts  ← POST: очистка cookies
    bets/route.ts         ← GET (список) + POST (нова ставка)
    bets/[id]/route.ts    ← GET: деталі ставки
    game/config/route.ts  ← GET: конфіг гри (rows, risks, payoutTables)
    seeds/route.ts        ← GET (active seed) + POST (client/rotate)
    seeds/[id]/route.ts   ← GET: деталі seed
    user/me/route.ts      ← GET: поточний юзер
```

---

## SSR Hydration Flow (layout.tsx)

При кожному запиті `RootLayout` (Server Component):

1. Читає cookies `accessToken` + `refreshToken`
2. Якщо є хоча б один → робить fetch на `/api/auth/session`
3. Отримує `{ accessToken, user }` або null
4. Читає `soundEffectsEnabled` + `animationsEnabled` з cookies
5. Рендерить провайдери у порядку: `QueryProvider → SettingsProvider → SessionProvider → children`

`SessionProvider` та `SettingsProvider` — Client Components що ініціалізують Zustand стори через render-phase sync (`if (initialized.current == null)`).

---

## API Routes (BFF)

Всі захищені route handlers використовують `getValidAccessToken()` з `@/shared/lib/auth-proxy`.

| Route | Method | Опис |
|-------|--------|------|
| `/api/auth/session` | GET | Валідація access token, refresh якщо expired |
| `/api/auth/logout` | POST | DELETE cookies accessToken + refreshToken |
| `/api/bets` | GET | Список ставок з пагінацією (cursor-based) |
| `/api/bets` | POST | Створити ставку |
| `/api/bets/[id]` | GET | Деталі ставки |
| `/api/game/config` | GET | Конфіг: rows[], risks[], minBet, maxBet, payoutTables |
| `/api/seeds` | GET | Активний seed |
| `/api/seeds` | POST | `?action=client` оновити clientSeed, `?action=rotate` ротація |
| `/api/seeds/[id]` | GET | Деталі réveilé seed |
| `/api/user/me` | GET | Поточний юзер (proxied через getValidAccessToken) |

---

## Middleware (src/proxy.ts)

Перевіряє `refreshToken` cookie (без запиту до бекенду):
- Protected routes (`/game`, `/history`) без refreshToken → redirect `/login`
- Public routes (`/login`, `/register`) з refreshToken → redirect `/game`

---

## Залежності

`app` → `pages` → `widgets` → `features` → `entities` → `shared`
