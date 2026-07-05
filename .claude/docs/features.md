# Layer: features

**Responsibility:** Interactive features — coordinate entities, call APIs, contain business logic.

---

## Slices

### `auth` — authentication

```
features/auth/
  actions/
    login.action.ts      ← Server Action: POST credentials → set cookies → return { ok, accessToken, user }
    register.action.ts   ← Server Action: POST register → set cookies → return { ok, accessToken, user }
    logout.action.ts     ← Server Action: delete cookies → redirect /login
  model/
    schemas.ts           ← zod: loginSchema, registerSchema + LoginFormValues, RegisterFormValues types
  ui/
    LoginForm.tsx        ← 'use client', react-hook-form + useMutation
    RegisterForm.tsx     ← 'use client', react-hook-form + useMutation
    AuthCard.tsx         ← card wrapper for auth forms
  index.ts
```

**Important:** Server Actions return `{ ok: true, accessToken, user }` or `{ ok: false, error: string }` — they never throw.

---

### `game` — gameplay orchestration

```
features/game/
  api/
    useGameConfig.ts     ← useQuery: GET /api/game/config → GameConfig
    usePlaceBet.ts       ← useMutation: POST /api/bets → BetResponseDto
    useCurrentUser.ts    ← useQuery: GET /api/user/me → User (key: ['me'])
    useLogout.ts         ← useMutation: POST /api/auth/logout → clearSession
    index.ts
  model/
    useGamePlay.ts       ← orchestrates bet: place → animation (Promise) → result → balance
  index.ts
```

**`useGamePlay`** — central gameplay hook:
- Accepts `{ setPlaying }`
- `handlePlaceBet(amount, rows, risk)` → mutation → awaits Promise from `animResolveMap` → toast → `queryClient.setQueryData(['me'])`
- `handleAnimationEnd(id)` → resolves the animation Promise for that ball; `isPlaying` set to `false` only when all animations complete
- Balance updated via `queryClient.setQueryData` without refetch

---

### `place-bet` — bet form

```
features/place-bet/
  model/
    useBetForm.ts    ← react-hook-form: betInput, handleHalf/Double/Max
    useAutoBet.ts    ← auto mode: bet loop with stop-profit/loss/count
  ui/
    QuickBetControls.tsx  ← ½ × Max buttons
  index.ts
```

**`useBetForm`:** All amounts use BigInt via `parseCredits/formatCredits`. Clamped to `[MIN_BET, min(balance, MAX_BET)]`.

**`useAutoBet`:** Effect-loop that places bets while `isAutoBetting = true`. Stops on:
- Reaching `numBets` count
- `stopProfit` or `stopLoss` threshold
- Amount validation error

---

### `bet-mode` — bet mode toggle

```
features/bet-mode/
  ui/
    BetModeToggle.tsx  ← Tabs: MANUAL / AUTO
  index.ts
```

Simple UI feature. Passes `value: BetMode` and `onChange` via props.

---

### `bet-history` — bet list

```
features/bet-history/
  api/
    useBetHistory.ts  ← useInfiniteQuery: GET /api/bets (cursor pagination)
    index.ts
  index.ts
```

**`useBetHistory(rows?: number)`:** Infinite query with cursor-based pagination. `nextCursor` from previous page → parameter for next request.

---

### `game-settings` — gameplay settings

```
features/game-settings/
  ui/
    SettingsDialog.tsx  ← Dialog with Switch for sound/animations
  index.ts
```

Reads and writes `useSettings()` from `entities/settings`. Displays version and mode (`Demo (Mock API)`).

---

## Dependencies

`features` → `entities`, `shared`. Must NOT import from `widgets` or `pages`.
