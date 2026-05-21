---
paths: ["src/**"]
---
# Project-Specific Pitfalls

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

## Entity imports

```ts
// ❌ breaks FSD encapsulation
import { useSessionStore } from '@/entities/session/model/store'
import type { User } from '@/entities/session/model/types'

// ✅ always through the public index
import { useSessionStore, type User } from '@/entities/session'
```

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

`animResolveRef.current?.()` in `handleAnimationEnd` resolves the bet flow Promise.
If you call `setPlaying(false)` before the animation ends, the ball will disappear mid-flight.
Always wait for `handleAnimationEnd` before finalising the bet result.

## Zustand store — no cross-entity imports

Entities must not import each other. Cross-entity coordination belongs in `features/`.

```ts
// ❌ inside entities/game/model/store.ts
import { useSessionStore } from '@/entities/session'

// ✅ coordinate in features/game/model/useGamePlay.ts
const user = useCurrentUser()
const addResult = useGameStore((s) => s.addResult)
```
