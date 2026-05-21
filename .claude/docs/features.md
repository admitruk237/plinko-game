# Layer: features

**Відповідальність:** Інтерактивні фічі — координують entities, викликають API, містять бізнес-логіку.

---

## Слайси

### `auth` — автентифікація

```
features/auth/
  actions/
    login.action.ts      ← Server Action: POST credentials → set cookies → return { ok, accessToken, user }
    register.action.ts   ← Server Action: POST register → set cookies → return { ok, accessToken, user }
    logout.action.ts     ← Server Action: DELETE cookies → redirect /login
  model/
    schemas.ts           ← zod: loginSchema, registerSchema + типи LoginFormValues, RegisterFormValues
  ui/
    LoginForm.tsx        ← 'use client', react-hook-form + useMutation
    RegisterForm.tsx     ← 'use client', react-hook-form + useMutation
    AuthCard.tsx         ← обгортка картки для auth форм
  index.ts
```

**Важливо:** Server Actions повертають `{ ok: true, accessToken, user }` або `{ ok: false, error: string }` — не кидають виняток.

---

### `game` — ігровий процес

```
features/game/
  api/
    useGameConfig.ts     ← useQuery: GET /api/game/config → GameConfig
    usePlaceBet.ts       ← useMutation: POST /api/bets → BetResponseDto
    useCurrentUser.ts    ← useQuery: GET /api/user/me → User (ключ: ['me'])
    useLogout.ts         ← useMutation: POST /api/auth/logout → clearSession
    index.ts
  model/
    useGamePlay.ts       ← оркеструє ставку: bet → анімація (Promise) → результат → баланс
  index.ts
```

**`useGamePlay`** — центральний хук геймплею:
- Приймає `{ isPlaying, setPlaying }`
- `handlePlaceBet(amount, rows, risk)` → мутація → чекає `animResolveRef` → `addResult` → `queryClient.setQueryData(['me'])`
- `handleAnimationEnd()` → резолвить Promise анімації
- Баланс оновлюється через `queryClient.setQueryData` без рефетчу

---

### `place-bet` — форма ставки

```
features/place-bet/
  model/
    useBetForm.ts    ← react-hook-form: betInput, handleHalf/Double/Max
    useAutoBet.ts    ← авто-режим: loop ставок з stop-profit/loss/count
  ui/
    QuickBetControls.tsx  ← кнопки ½ × Max
  index.ts
```

**`useBetForm`:** Всі суми — BigInt через `parseCredits/formatCredits`. Клампінг до `[MIN_BET, min(balance, MAX_BET)]`.

**`useAutoBet`:** Ефект-цикл що запускає ставки поки `isAutoBetting = true`. Зупиняється по:
- Досягнення `numBets` кількості
- `stopProfit` або `stopLoss` порогу
- Помилці валідації суми

---

### `bet-mode` — перемикач режиму ставки

```
features/bet-mode/
  ui/
    BetModeToggle.tsx  ← Tabs: MANUAL / AUTO
  index.ts
```

Проста UI фіча. Пропускає `value: BetMode` і `onChange` через props.

---

### `bet-history` — список ставок

```
features/bet-history/
  api/
    useBetHistory.ts  ← useInfiniteQuery: GET /api/bets (cursor pagination)
    index.ts
  index.ts
```

**`useBetHistory(rows?: number)`:** Infinite query з `cursor`-based пагінацією. `nextCursor` від попередньої сторінки → параметр наступного запиту.

---

### `game-settings` — налаштування геймплею

```
features/game-settings/
  ui/
    SettingsDialog.tsx  ← Dialog з Switch для sound/animations
  index.ts
```

Читає і пише `useSettings()` з `entities/settings`. Відображає версію і режим (`Demo (Mock API)`).

---

## Залежності

`features` → `entities`, `shared`. НЕ імпортує `widgets` або `pages`.
