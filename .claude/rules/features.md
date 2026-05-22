---
paths: ["src/features/**"]
---
# Layer: features

Interactive features — user actions that involve business logic and may coordinate multiple entities.

## Structure

Each feature lives in its own slice:
```
features/
  place-bet/
    ui/          ← React components for this feature
    model/       ← hooks, local state, side-effects
    api/         ← feature-specific API calls (if any)
    index.ts     ← public API
```

## Rules

- This is the correct place to **coordinate between entities** (e.g. reading balance from `session`, updating game state from `game`)
- Import entities ONLY through their public `index.ts` — never reach into `entity/model/store.ts` directly
- Import other features ONLY through their public `index.ts` — never reach into `feature/model/` or `feature/ui/` directly
- Features MUST NOT import from `widgets/` or `pages/`
- Keep UI components in `ui/`, business logic in `model/` — no logic inside JSX
- Each feature exposes a single public API via `index.ts`
