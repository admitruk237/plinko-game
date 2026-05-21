# Layer: entities

**Відповідальність:** Бізнес-сутності — ізольований стан і типи без міжсутнісних залежностей.

---

## Слайси

### `session` — стан авторизації

```
entities/session/
  model/
    store.ts   ← useSessionStore
    types.ts   ← SessionState, User (re-export з shared/api/types)
  index.ts     ← публічне API
```

**Store:** `useSessionStore` (Zustand, без persist — навмисно)

| Поле | Тип | Опис |
|------|-----|------|
| `accessToken` | `string \| null` | JWT токен доступу |
| `user` | `User \| null` | Поточний юзер |
| `setSession(token, user)` | action | Встановлюється після логіну або SSR hydration |
| `clearSession()` | action | Встановлюється після logout |

`User` тип: `{ id, email, balance, createdAt }`

**Примітка:** Store не persist бо токен зберігається в httpOnly cookie — стор лише дзеркалить серверний стан для клієнта.

---

### `game` — стан геймплею

```
entities/game/
  model/
    store.ts   ← useGameStore
    types.ts   ← BetResult, BallAnimation + re-exports з shared/api/types
  index.ts
```

**Store:** `useGameStore` (Zustand, без persist)

| Поле | Тип | Опис |
|------|-----|------|
| `recentResults` | `BetResult[]` | Останні 4 результати (новий додається в початок) |
| `isPlaying` | `boolean` | Чи грає зараз куля |
| `addResult(result)` | action | Додає результат, обрізає до 4 |
| `setPlaying(bool)` | action | Керується з `useGamePlay` |
| `clearResults()` | action | Очищення при виході |

**Типи:**

```ts
interface BetResult {
  betId: string
  multiplier: number   // число, не рядок
  payout: string       // рядок-кредити
  path: string         // бінарний рядок L/R ходів
  bucketIndex: number  // 0-based індекс бакету
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

### `settings` — налаштування гравця

```
entities/settings/
  model/
    store.ts   ← useSettingsStore + useSettings()
  index.ts
```

**Store:** `useSettingsStore` (Zustand, persist через cookies — для SSR доступності)

| Поле | Тип | Default |
|------|-----|---------|
| `soundEffectsEnabled` | `boolean` | `true` |
| `animationsEnabled` | `boolean` | `true` |

Зміна налаштувань одразу пише в cookie (`soundEffectsEnabled`, `animationsEnabled`) щоб layout.tsx міг зчитати при наступному SSR.

**Хук:** `useSettings()` — зручна обгортка для доступу до стору.

---

## Публічне API (index.ts)

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

## Залежності

`entities` → `shared` тільки. Сутності не імпортують одна одну.
