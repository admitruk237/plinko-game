---
paths: ["src/features/game/**", "src/features/place-bet/**", "src/features/bet-mode/**", "src/entities/game/**", "src/app/api/bets/**", "src/app/api/game/**"]
---
# Game Domain

Core plinko gameplay. Spans: `entities/game` (state), `features/game` (orchestration), `features/place-bet` (bet form), `features/bet-mode` (manual/auto toggle).

## Game flow — `useGamePlay`

The central hook that orchestrates a single bet round:

1. `handlePlaceBet(amount, rows, risk)` called → sets `isPlaying = true`
2. Calls `POST /api/bets` via `usePlaceBet` mutation
3. Backend returns `{ path, bucketIndex, multiplier, payout, balanceAfter, ... }`
4. **Animation promise**: creates a `Promise` resolved by `animResolveRef` — waits until the ball animation completes on canvas
5. `handleAnimationEnd()` fires from the canvas component → resolves the promise
6. `addResult(...)` adds to `useGameStore.recentResults` (capped at 4)
7. Balance updated optimistically: `queryClient.setQueryData(['me'], ...)` — no refetch needed
8. `isPlaying = false`

## Amounts — BigInt credits

All monetary values are **strings representing integer cents** (e.g. `"100"` = 1.00 credits):
- Use `parseCredits(str)` → `BigInt` for arithmetic
- Use `formatCredits(bigint)` → display string
- `MIN_BET`, `MAX_BET` constants from `@/shared/lib/credits`
- NEVER use `parseFloat` / `Number` for bet amounts — precision loss

## Game state — `useGameStore`

```ts
recentResults: BetResult[]  // last 4 results, newest first
isPlaying: boolean
```

`isPlaying` is the single source of truth for disabling UI during animation.

## Bet form — `useBetForm`

Controlled via `react-hook-form`. Provides `handleHalf`, `handleDouble`, `handleMax` — all clamp to `[MIN_BET, min(balance, MAX_BET)]`.

## Rules

- `isPlaying` guard MUST be checked before placing a bet — `handlePlaceBet` returns early if true
- Balance update goes through `queryClient.setQueryData(['me'])` — do NOT call `setSession` or invalidate the query
- `path` from bet response is a binary string of L/R moves, length = `rows`
- `bucketIndex` is 0-based, used to highlight the landing bucket
- Auto-bet (`useAutoBet`) loops `handlePlaceBet` with a configurable delay — respects `isPlaying` state
