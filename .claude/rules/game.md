---
paths: ["src/features/game/**", "src/features/place-bet/**", "src/features/bet-mode/**", "src/entities/game/**", "src/app/api/bets/**", "src/app/api/game/**"]
---
# Game Domain

Core plinko gameplay. Spans: `entities/game` (state), `features/game` (orchestration), `features/place-bet` (bet form), `features/bet-mode` (manual/auto toggle).

## Game flow — `useGamePlay`

The central hook that orchestrates bet rounds. Supports multiple concurrent balls.

1. `handlePlaceBet(amount, rows, risk)` called → increments `activeCount`, sets `isPlaying = true`
2. Calls `POST /api/bets` via `usePlaceBet` mutation
3. Backend returns `{ path, bucketIndex, multiplier, payout, balanceAfter, ... }`
4. **Animation promise**: creates a `Promise` resolved by `animResolveMap` keyed by `betId` — waits until the ball animation completes on canvas
5. `handleAnimationEnd(id)` fires from the canvas component → resolves the promise for that ball
6. Shows toast with multiplier and payout
7. Balance updated optimistically: `queryClient.setQueryData(['me'], ...)` — no refetch needed
8. Decrements `activeCount`; sets `isPlaying = false` only when `activeCount === 0`

## Amounts — BigInt credits

All monetary values are **strings representing integer cents** (e.g. `"100"` = 1.00 credits):
- Use `parseCredits(str)` → `BigInt` for arithmetic
- Use `formatCredits(bigint)` → display string
- `MIN_BET`, `MAX_BET` constants from `@/shared/lib/credits`
- NEVER use `parseFloat` / `Number` for bet amounts — precision loss

## Game state — `useGameStore`

```ts
isPlaying: boolean
```

`isPlaying` is `true` while at least one ball is animating. Used to gate auto-bet loop.

## Bet form — `useBetForm`

Controlled via `react-hook-form`. Provides `handleHalf`, `handleDouble`, `handleMax` — all clamp to `[MIN_BET, min(balance, MAX_BET)]`. Writes to `usePlaceBetStore.betAmount` directly in each handler (no `useEffect` mirror).

## Rules

- Multiple balls can be in flight simultaneously — `handlePlaceBet` does NOT return early if `isPlaying`
- `isPlaying` becomes `false` only when all active animations complete (`activeCount === 0`)
- Balance update goes through `queryClient.setQueryData(['me'])` — do NOT call `setSession` or invalidate the query
- `path` from bet response is a binary string of L/R moves, length = `rows`
- `bucketIndex` is 0-based, used to highlight the landing bucket
- Auto-bet (`useAutoBet`) loops `handlePlaceBet` and checks `isWaitingForBet` to avoid stacking bets
