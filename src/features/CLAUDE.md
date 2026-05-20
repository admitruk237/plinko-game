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
- Import entities only through their public `index.ts` — never reach into `entity/model/store.ts` directly from here
- Features MUST NOT import from `widgets/` or `pages/`
- Keep UI components in `ui/`, business logic in `model/` — no logic inside JSX
- Each feature exposes a single public API via `index.ts`
