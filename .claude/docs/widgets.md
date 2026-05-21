# Layer: widgets

**Відповідальність:** Складні UI блоки що компонують features і entities у готові секції сторінок.

---

## Слайси

### `game-client` — головний клієнтський блок гри

```
widgets/game-client/
  GameClient.tsx   ← 'use client', оркеструє всю гру
```

**Головний композитний компонент гри.** Збирає разом:
- `useGameConfig()` — завантажує конфіг
- `useCurrentUser()` — баланс юзера
- `useGameStore` — `isPlaying`, `setPlaying`
- `useGamePlay()` — логіка ставки
- `GameSidebar` + `PlinkoBoard` + `GameHeader` + `RecentResults`

Передає `handlePlaceBet`, `currentAnimation`, `handleAnimationEnd` до дочірніх компонентів.

---

### `game-board` — Plinko дошка

```
widgets/game-board/
  PlinkoBoard.tsx  ← Canvas-анімація кулі
```

Рендерить Plinko сітку на `<canvas>`. Анімує кулю по `path` (L/R рядок). При завершенні анімації викликає `onAnimationEnd()` що резолвить Promise в `useGamePlay`.

**Props:**
- `rows: number` — кількість рядів
- `risk: Risk` — для підсвічування бакетів
- `currentAnimation: BallAnimation | null`
- `onAnimationEnd: () => void`
- `payoutTable: number[]` — множники для відображення

---

### `game-sidebar` — бічна панель керування

```
widgets/game-sidebar/
  GameSidebar.tsx           ← основний компонент
  model/
    useGameSidebar.ts       ← агрегує useBetForm + useAutoBet
    constants.ts            ← LABELS, STYLES, ZERO
  ui/
    BetModeToggle wrapper
    RiskSelector.tsx        ← вибір ризику (LOW/MEDIUM/HIGH)
    RowsSelector.tsx        ← Slider для кількості рядів
    AutoBetSettings.tsx     ← поля numBets, stopProfit, stopLoss
    BetButton.tsx           ← кнопка Bet/Start/Stop з лоадером
    SidebarFooter.tsx       ← fullscreen + settings кнопки
```

**`useGameSidebar`:** Агрегує `useBetForm` і `useAutoBet` в єдиний інтерфейс для `GameSidebar`.

---

### `game-header` — шапка гри

```
widgets/game-header/
  GameHeader.tsx
```

Відображає логотип, баланс юзера і кнопку logout. Читає `user.balance` через props.

---

### `recent-results` — останні результати

```
widgets/recent-results/
  RecentResults.tsx
```

Показує останні 4 результати ставок (`useGameStore.recentResults`). Кольори по множнику через `getMultiplierColor()`.

---

### `history-client` — клієнт сторінки історії

```
widgets/history-client/
  HistoryClient.tsx     ← фільтр + infinite scroll + таблиця
  BetTable.tsx          ← таблиця ставок
  BetDetailDrawer.tsx   ← drawer з деталями ставки
```

**`HistoryClient`:**
- Фільтр по кількості рядів (select: all / 8–16)
- `useBetHistory(rowsParam)` — infinite query
- Load More кнопка з `hasNextPage` / `isFetchingNextPage`
- Клік на рядок → `BetDetailDrawer`

**`BetDetailDrawer`:** Sliding панель з деталями: multiplier, payout, path, seed info.

---

## Залежності

`widgets` → `features`, `entities`, `shared`. НЕ імпортує `pages` або `app`.
