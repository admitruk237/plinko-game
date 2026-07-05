---
paths: ["src/**"]
---
# Naming Conventions

## Core principle

Names must reflect **what happens in this game**, not what pattern was used to write the code.
A reader should understand the game domain from the name alone — without reading the implementation.

---

## Domain vocabulary

Use these terms consistently. Do not replace them with generic synonyms.

| Term | Meaning | Use for |
|------|---------|---------|
| `ball` | The falling plinko ball | animation state, position, physics |
| `peg` | A pin the ball bounces off | grid positions, collision |
| `bucket` / `slot` | The landing pocket at the bottom | `bucketIndex`, final position |
| `path` | Binary L/R string of ball movement | `bet.path`, animation traversal |
| `drop` | The act of placing a bet + launching the ball | user action verb |
| `land` | Ball reaching a bucket | end of animation |
| `rows` | Number of peg rows (board height) | config, selector |
| `risk` | Risk level (LOW/MEDIUM/HIGH) | game config, bet params |
| `multiplier` | Payout coefficient | result display, coloring |
| `payout` | Credits won on a bet | result, history |
| `stake` | Amount wagered | bet input field |
| `balance` | Player's credit balance | user state |
| `credits` | Internal monetary unit | formatting, arithmetic |
| `currentAnimations` | Active ball animations array | `useGamePlay` state |
| `seed` | Provably fair seed data | crypto fairness feature |

---

## Anti-patterns — never use these

```ts
// ❌ Generic handlers
handleInputChange   → handleStakeChange
handleBet           → drop / executeDrop

// ❌ Vague state
isLoading           → isFetchingConfig / isDropPending
data                → config / betResult / user
result              → dropResult / betOutcome
response            → betResponse / sessionData
value               → stake / multiplier / rowCount

// ❌ Negative boolean flags
isManualDisabled    → canDropManually
isAutoDisabled      → canDropAuto
isDisabled          → blocked / idle

// ❌ Weak prop names
onChange            → onRiskSelect / onRowsChange / onStakeChange
onClick             → onDrop / onStop / onLogout
onClose             → onDrawerClose / onDialogDismiss
min / max           → minRows / maxRows / minStake / maxStake
items               → bets / results / risks
```

---

## Patterns to follow

### Hooks
```ts
// ✅ Name = what the hook manages, not what it does
useBallAnimation()     // manages the ball animation state
useDropFlow()          // orchestrates a full bet round
useStakeForm()         // form for entering a stake
useAutoDropLoop()      // auto-bet loop
```

### Event handlers
```ts
// ✅ on + specific noun + specific verb (if needed)
onDrop()               // user initiates a ball drop
onLand()               // ball reaches a bucket
onRiskSelect(risk)     // user picks a risk level
onRowsChange(rows)     // user changes row count
onStakeChange(amount)  // user edits stake input
onAutoStart()          // user starts auto-bet
onAutoStop()           // user stops auto-bet
```

### `handle*` vs `on*`

- **`handle*`** — DOM event handlers і обробники від бібліотек (`handleSubmit` від react-hook-form, `handleKeyDown`, `handleDrop`)
- **`on*`** — колбеки що передаються через props або є бізнес-логікою (`onDrop`, `onRiskSelect`)

```ts
// ✅ handleSubmit — react-hook-form повертає цей метод, залишаємо як є
form.handleSubmit(onDrop)

// ✅ onDrop — бізнес-колбек у props
interface Props { onDrop: () => void }
```

### State variables
```ts
// ✅ Precise, affirmative, domain-rooted
isPlaying              // game store — source of truth for ball animation gate
isDropPending          // not isLoading (for bet mutation)
currentAnimations      // useGamePlay state — active ball animations
activeSlot             // not bucketIndex (in animation context)
stakeInput             // not betInput
rowCount               // not rows (local variable)
```

### Props interfaces
```ts
// ✅ Specific, never generic
interface Props {
  minRows: number
  maxRows: number
  onRiskSelect: (risk: Risk) => void
  onRowsChange: (rows: number) => void
  stake: string
}
```

---

## Scope rules

- **Single-letter variables** only in math/geometry: `x`, `y`, `r` (radius), `i` (loop index over known small range)
- **`current*` prefix** — only when contrasting with a previous/next value. Do not use as a generic qualifier (`currentUser` → `user`)
- **`get*` functions** — pure derivations only. Side-effectful functions use a verb: `drop()`, `rotate()`, `fetch*()`
