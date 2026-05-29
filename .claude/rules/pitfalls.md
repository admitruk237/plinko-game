---
paths: ["src/**"]
---
# Project-Specific Pitfalls

## React namespace — never use `React.*` types

NEVER use `React.ChangeEvent`, `React.MouseEvent`, `React.ReactNode`, etc.
Always import types directly from `'react'`:

```ts
// ❌ FORBIDDEN
(e: React.ChangeEvent<HTMLInputElement>)
const icon: React.ReactNode
(e?: React.MouseEvent<HTMLDivElement>)

// ✅ REQUIRED — import the type directly
import { type ChangeEvent, type MouseEvent, type ReactNode } from 'react'
(e: ChangeEvent<HTMLInputElement>)
const icon: ReactNode
(e?: MouseEvent<HTMLDivElement>)
```

`import React from 'react'` is also forbidden — always use named imports.

## Magic strings in react-hook-form

NEVER use raw string literals for field names in `form.watch()`, `form.setValue()`, `form.getValues()`.
Define a constant at the top of the file:

```ts
// ❌
const value = form.watch('betInput')
form.setValue('betInput', newValue)

// ✅
const BET_FIELD = 'betInput' as const
const value = form.watch(BET_FIELD)
form.setValue(BET_FIELD, newValue)
```

Common mistakes in this codebase — always check these before writing code.

## Credits / Balance

```ts
// ❌ precision loss — NEVER
const amount = Number(balance) * 0.5
parseFloat(betInput)

// ✅ always BigInt via shared/lib/credits
const amount = parseCredits(betInput)   // display string → bigint
const display = formatCredits(raw)       // raw DB string → display string
```

`1 credit = 1_000_000 internal units` (6 decimal places). Raw values (from API, store) are strings like `"1000000"` = 1.00 credit.

## Balance update after bet

```ts
// ❌ wrong — triggers session re-hydration
setSession(token, { ...user, balance: bet.balanceAfter })

// ✅ correct — optimistic update without refetch
queryClient.setQueryData<User>(['me'], (old) =>
  old ? { ...old, balance: bet.balanceAfter } : old
)
```

Query key for current user is always `['me']` — never change it.

## Public API — always through index.ts

Every layer slice exposes a public API via `index.ts`. NEVER import directly from internal paths (`model/`, `ui/`, `api/`, `actions/`).

```ts
// ❌ breaks FSD encapsulation
import { useSessionStore } from '@/entities/session/model/store'
import type { User } from '@/entities/session/model/types'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { GameClient } from '@/widgets/game-client/GameClient'

// ✅ always through the public index
import { useSessionStore, type User } from '@/entities/session'
import { LoginForm } from '@/features/auth'
import { GameClient } from '@/widgets'
```

Applies to ALL layers: `entities`, `features`, `widgets`.

## Server-only modules

`@/shared/lib/session` and `@/shared/lib/auth-proxy` import `'server-only'`.
They will throw at build time if imported in a Client Component.
Use `getValidAccessToken()` only in route handlers and Server Actions.

## useEffect anti-patterns

```ts
// ❌ mirrors prop into state — causes cascading renders
useEffect(() => { setRows(config.rows[0]) }, [config])

// ✅ render-phase sync (from CLAUDE.md performance rules)
if (rows !== config.rows[0] && someCondition) setRows(config.rows[0])
```

## react-hook-form watch()

`form.watch('field')` is incompatible with React Compiler memoization — the compiler skips the entire hook. Do not wrap hooks using `watch()` with `useMemo`; accept the limitation or use `form.getValues()` where possible.

## Animation promise

`animResolveMap.current.get(id)?.()` in `handleAnimationEnd(id)` resolves the per-ball Promise.
`isPlaying` is set to `false` only when `activeCount` reaches 0 (all balls landed).
Never call `setPlaying(false)` directly — let `useGamePlay` manage it via `activeCount`.

## Zustand — useShallow для об'єктних селекторів

Селектор що повертає об'єкт або масив створює нову референцію на кожен рендер → нескінченні ре-рендери. Використовуй `useShallow` скрізь де селектор повертає не примітив.

```ts
import { useShallow } from 'zustand/react/shallow'

// ❌ новий об'єкт щоразу — ре-рендер на кожен store update
const { isPlaying, setPlaying } = useGameStore((s) => ({
  isPlaying: s.isPlaying,
  setPlaying: s.setPlaying,
}))

// ✅ shallow comparison — ре-рендер тільки якщо значення змінились
const { isPlaying, setPlaying } = useGameStore(
  useShallow((s) => ({ isPlaying: s.isPlaying, setPlaying: s.setPlaying }))
)

// ✅ примітив — useShallow не потрібен
const isPlaying = useGameStore((s) => s.isPlaying)
```

Правило діє в усіх шарах: `entities`, `features`, `widgets`.

## Zustand store — no cross-entity imports

Entities must not import each other. Cross-entity coordination belongs in `features/`.

```ts
// ❌ inside entities/game/model/store.ts
import { useSessionStore } from '@/entities/session'

// ✅ coordinate in features/game/model/useGamePlay.ts
const user = useCurrentUser()
const setPlaying = useGameStore((s) => s.setPlaying)
```
