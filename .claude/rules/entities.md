---
paths: ["src/entities/**"]
---
# Layer: entities

Business entities — data shapes and their isolated state.

## Structure

Each entity lives in its own slice:
```
entities/
  session/
    model/
      store.ts   ← Zustand store
    index.ts     ← public API (re-exports)
```

## Rules

- An entity MUST NOT import from another entity — zero cross-entity coupling
- An entity owns its Zustand store; no other layer writes directly to it except via the store's actions
- Stores use `persist` middleware when state must survive page reload (e.g. `useSessionStore` → `'session-storage'`)
- Export only what other layers need through the slice's `index.ts` — keep internals private
- Cross-entity coordination belongs in `features/`, not here
