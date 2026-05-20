# Layer: shared

Generic, reusable building blocks with zero domain knowledge.

## Structure

- `ui/` — shadcn/ui components (Button, Input, etc.)
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `lib/hooks/` — generic hooks (useDebounce, useMediaQuery, etc.)
- `api/` — base API client / fetch wrappers (if needed)

## Rules

- Components here MUST be **domain-agnostic** — no game logic, no store imports
- NEVER import from `entities/`, `features/`, `widgets/`, or `pages/` here
- Add shadcn components via CLI — they land here automatically:
  ```bash
  npx shadcn@latest add [component-name]
  ```
- All imports within the app use the alias `@/shared/...` — never relative `../`
- `cn()` is the only way to merge class names — import from `@/shared/lib/utils`
