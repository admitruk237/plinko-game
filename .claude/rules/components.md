---
paths: ["src/**/*.tsx", "src/**/*.ts"]
---
# Component Rules

## Export style

Always `export const`, never `export default`:

```tsx
// ✅
export const BetDetailDrawer = ({ bet, onClose }: Props) => { ... }
// ❌
export default function BetDetailDrawer() { }
```

## Props

Interface is always named `Props`, all fields explicitly typed:

```ts
interface Props {
  value: number
  onClick: () => void
}
```

## Clean JSX — zero business logic in components

Components render only. Logic lives elsewhere:

| What | Where |
|------|-------|
| State, effects, store reads | `model/useComponentName.ts` in the same slice |
| Data transformations | `shared/lib/` utils |
| API calls | `api/` in the slice |
| Constants | top of file or `shared/config/constants.ts` |

## shadcn/ui first

Before writing any UI primitive — check `src/shared/ui/` for an existing shadcn component.
Use `Button`, `Input`, `Card`, `Dialog`, `Switch`, `Tabs`, `Form`/`FormField`/`FormItem` etc. whenever applicable.
Do NOT write custom alternatives to what shadcn already provides.

## Size limit

If a component exceeds ~80 lines or contains multiple independent visual blocks — split into sub-components, one file each.
