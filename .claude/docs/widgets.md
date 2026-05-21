# Layer: widgets

**Responsibility:** Complex UI blocks that compose features and entities into ready-to-use page sections.

---

## Slices

### `game-client` — main client game block

```
widgets/game-client/
  GameClient.tsx   ← 'use client', orchestrates the entire game
```

**Main composite game component.** Wires together:
- `useGameConfig()` — loads game config
- `useCurrentUser()` — user balance
- `useGameStore` — `isPlaying`, `setPlaying`
- `useGamePlay()` — bet logic
- `GameSidebar` + `PlinkoBoard` + `GameHeader` + `RecentResults`

Passes `handlePlaceBet`, `currentAnimation`, `handleAnimationEnd` down to child components.

---

### `game-board` — Plinko board

```
widgets/game-board/
  PlinkoBoard.tsx  ← Canvas ball animation
```

Renders the Plinko grid on `<canvas>`. Animates the ball along `path` (L/R string). On animation end calls `onAnimationEnd()` which resolves the Promise in `useGamePlay`.

**Props:**
- `rows: number` — number of rows
- `risk: Risk` — for bucket highlighting
- `currentAnimation: BallAnimation | null`
- `onAnimationEnd: () => void`
- `payoutTable: number[]` — multipliers for display

---

### `game-sidebar` — game control panel

```
widgets/game-sidebar/
  GameSidebar.tsx           ← main component
  model/
    useGameSidebar.ts       ← aggregates useBetForm + useAutoBet
    constants.ts            ← LABELS, STYLES, ZERO
  ui/
    RiskSelector.tsx        ← risk picker (LOW/MEDIUM/HIGH)
    RowsSelector.tsx        ← Slider for row count
    AutoBetSettings.tsx     ← numBets, stopProfit, stopLoss fields
    BetButton.tsx           ← Bet/Start/Stop button with loader
    SidebarFooter.tsx       ← fullscreen + settings buttons
```

**`useGameSidebar`:** Aggregates `useBetForm` and `useAutoBet` into a single interface for `GameSidebar`.

---

### `game-header` — game header

```
widgets/game-header/
  GameHeader.tsx
```

Displays logo, user balance, and logout button. Reads `user.balance` via props.

---

### `recent-results` — recent results strip

```
widgets/recent-results/
  RecentResults.tsx
```

Shows last 4 bet results (`useGameStore.recentResults`). Colors by multiplier via `getMultiplierColor()`.

---

### `history-client` — history page client

```
widgets/history-client/
  HistoryClient.tsx     ← filter + infinite scroll + table
  BetTable.tsx          ← bet table
  BetDetailDrawer.tsx   ← sliding drawer with bet details
```

**`HistoryClient`:**
- Filter by row count (select: all / 8–16)
- `useBetHistory(rowsParam)` — infinite query
- Load More button with `hasNextPage` / `isFetchingNextPage`
- Row click → `BetDetailDrawer`

**`BetDetailDrawer`:** Sliding panel with details: multiplier, payout, path, seed info.

---

## Dependencies

`widgets` → `features`, `entities`, `shared`. Must NOT import from `pages` or `app`.
