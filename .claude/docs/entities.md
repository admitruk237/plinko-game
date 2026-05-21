# Layer: entities

**Responsibility:** Business entities — isolated state and types with no cross-entity dependencies.

---

## Slices

### `session` — auth state

```
entities/session/
  model/
    store.ts   ← useSessionStore
    types.ts   ← SessionState, User (re-export from shared/api/types)
  index.ts     ← public API
```

**Store:** `useSessionStore` (Zustand, no persist — intentional)

| Field | Type | Description |
|-------|------|-------------|
| `accessToken` | `string \| null` | JWT access token |
| `user` | `User \| null` | Current user |
| `setSession(token, user)` | action | Called after login or SSR hydration |
| `clearSession()` | action | Called after logout |

`User` type: `{ id, email, balance, createdAt }`

**Note:** No persist because the token lives in an httpOnly cookie — the store merely mirrors server state for the client.

---

### `game` — gameplay state

```
entities/game/
  model/
    store.ts   ← useGameStore
    types.ts   ← BetResult, BallAnimation + re-exports from shared/api/types
  index.ts
```

**Store:** `useGameStore` (Zustand, no persist)

| Field | Type | Description |
|-------|------|-------------|
| `recentResults` | `BetResult[]` | Last 4 results, newest first |
| `isPlaying` | `boolean` | Whether the ball is currently animating |
| `addResult(result)` | action | Prepends result, trims to 4 |
| `setPlaying(bool)` | action | Controlled by `useGamePlay` |
| `clearResults()` | action | Reset on exit |

**Types:**

```ts
interface BetResult {
  betId: string
  multiplier: number   // number, not string
  payout: string       // credit string
  path: string         // binary L/R string
  bucketIndex: number  // 0-based bucket index
  rows: number
  risk: Risk
}

interface BallAnimation {
  path: string
  bucketIndex: number
  startTime: number
}
```

---

### `settings` — player settings

```
entities/settings/
  model/
    store.ts   ← useSettingsStore + useSettings()
  index.ts
```

**Store:** `useSettingsStore` (Zustand, persisted via cookies — for SSR accessibility)

| Field | Type | Default |
|-------|------|---------|
| `soundEffectsEnabled` | `boolean` | `true` |
| `animationsEnabled` | `boolean` | `true` |

Changing a setting immediately writes to cookie (`soundEffectsEnabled`, `animationsEnabled`) so `layout.tsx` can read it on the next SSR request.

**Hook:** `useSettings()` — convenience wrapper for store access.

---

## Public API (index.ts)

```ts
// entities/session
export { useSessionStore } from './session'
export type { User } from './session'

// entities/game
export { useGameStore } from './game'
export type { BetResult, BallAnimation, GameConfig, Risk, BetResponse } from './game'

// entities/settings
export { useSettings, useSettingsStore } from './settings'

// entities/index.ts
export * from './session'
export * from './game'
export * from './settings'
```

---

## Dependencies

`entities` → `shared` only. Entities do not import each other.
