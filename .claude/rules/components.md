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

## No inline styles

NEVER use `style={}` prop in JSX — use Tailwind classes only:

```tsx
// ❌
<div style={{ color: 'red', marginTop: 8 }}>...</div>
<div style={dynamicStyle}>...</div>

// ✅
<div className="text-red-500 mt-2">...</div>
<div className={cn('base', isActive && 'text-green-500')}>...</div>
```

If a color or value isn't in Tailwind — add it as a CSS variable in `globals.css` and use it via a semantic class.

## shadcn/ui first

Before writing any UI primitive — check `src/shared/ui/` for an existing shadcn component.
Use `Button`, `Input`, `Card`, `Dialog`, `Switch`, `Tabs`, `Form`/`FormField`/`FormItem` etc. whenever applicable.
Do NOT write custom alternatives to what shadcn already provides.
If you need custom styles or variants, extend the existing shadcn component in `src/shared/ui/` by adding a new variant with `cva` and forwarding props instead of inline styles or bespoke classes.

## Working with Images

NEVER use the native `<img>` HTML element. Always use the Next.js `Image` component (`import Image from 'next/image'`) to ensure proper image optimization, lazy loading, and layout responsiveness.

## Size limit

If a component exceeds ~120 lines or contains multiple independent visual blocks — split into sub-components, one file each.
