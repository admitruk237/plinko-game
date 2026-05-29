# Layer: widgets

**Responsibility:** Complex UI blocks that compose features and entities into ready-to-use page sections.

---

## Slices

### `game-client` — main client game block

```
widgets/game-client/
  GameClient.tsx          ← 'use client', renders the game layout
  model/
    useGameClient.ts      ← all orchestration logic (state, hooks, handlers)
```

**Main composite game component.** `useGameClient` aggregates:
- `useGameConfig()` — loads game config
- `useCurrentUser()` + session store — user balance
- `useGameStore` — `setPlaying`
- `useGamePlay()` — bet logic (`currentAnimations`, `handlePlaceBet`, `handleAnimationEnd`)
- logout handlers, sound hooks

`GameClient.tsx` renders only — composes `Header` + `GameSidebar` + `PlinkoBoard` + `CompactBetController` from the values returned by `useGameClient`.

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

### `header` — reusable page header

```
widgets/header/
  Header.tsx
```

Generic top bar used across pages (game, history, profile, progress). Renders a title and optional pieces driven by props — there is no game-specific logic here.

**Props:**
- `title: string`
- `balance?: string` + `showBalance?: boolean` — formatted balance pill
- `showBackButton?: boolean` + `backRoute?: string` — animated "Back to Game" link
- `rightAction?: ReactNode` — slot for page-specific actions (e.g. logout)

---

### `bottom-nav` — mobile bottom navigation

```
widgets/bottom-nav/
  BottomNav.tsx
  model/
    useBottomNav.tsx   ← builds nav items, hover animation refs, active state
    constants.ts       ← NAV_ITEMS_CONFIG, icon sizes
```

Fixed footer with four tabs (Game / Progress / History / Profile). Active tab is derived from `usePathname()`; an animated indicator bar slides between tabs via `motion` `layoutId`. Each icon is ref-controlled (`*IconHandle`) so hover triggers its animation. Tab clicks play a click sound via `useSound()`.

---

### `history-client` — history page client

```
widgets/history-client/
  HistoryClient.tsx       ← renders Header + filters + table + infinite-scroll sentinel
  BetTable.tsx            ← TanStack Table of bets
  model/
    useHistory.ts         ← filter state, useBetHistory query, IntersectionObserver auto-load
    useBetColumns.tsx     ← column definitions for BetTable
    constants.ts          ← filter values, messages
  ui/
    HistoryFilters.tsx    ← risk + rows filter selects
```

**`useHistory`:** Holds `filterRows` / `filterRisk` state, calls `useBetHistory(rowsParam, riskParam)` (infinite query), flattens pages into `allBets`, and auto-loads the next page when `sentinelRef` enters the viewport.

**`HistoryClient`:** Render-only — wires `useHistory` into `Header`, `HistoryFilters`, and `BetTable`, with a `BottomNav` footer. Empty/loading states use `LoadingState`.

---

## Dependencies

`widgets` → `features`, `entities`, `shared`. Must NOT import from `pages` or `app`.
