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
| `trail` | Recent bet results (last 4) | `recentResults` → `betTrail` |
| `seed` | Provably fair seed data | crypto fairness feature |

---

## Anti-patterns — never use these

```ts
// ❌ Generic handlers
handleInputChange   → handleStakeChange
handleBet           → drop / executeDrop
handleClick         → onDrop / onRiskSelect

// ❌ Vague state
isPlaying           → isBallAnimating
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
useBetTrail()          // last N bet results
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

### State variables
```ts
// ✅ Precise, affirmative, domain-rooted
isBallAnimating        // not isPlaying
isDropPending          // not isLoading (for bet mutation)
betTrail               // not recentResults
activeSlot             // not bucketIndex (in animation context)
stakeInput             // not betInput
rowCount               // not rows (local variable)
```

### Props interfaces
```ts
// ✅ Specific, never generic
interface Props {
  minRows: number       // not min
  maxRows: number       // not max
  onRiskSelect: (risk: Risk) => void    // not onChange
  onRowsChange: (rows: number) => void  // not onChange
  stake: string         // not value / betInput
}
```

---

## Scope rules

- **Single-letter variables** only in math/geometry: `x`, `y`, `r` (radius), `i` (loop index over known small range)
- **`handle*` prefix** — only for raw DOM event handlers (`handleKeyDown`, `handleSubmit`). All business logic callbacks use `on*`
- **`current*` prefix** — only when contrasting with a previous/next value. Do not use as a generic qualifier (`currentUser` → `user`, `currentAnimation` → `ballAnimation`)
- **`get*` functions** — pure derivations only. Side-effectful functions use a verb: `drop()`, `rotate()`, `fetch*()`
