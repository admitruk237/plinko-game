---
paths: ["src/**/*.tsx", "src/**/*.ts"]
---
# Component Rules

## Server vs Client — Next.js App Router

Every component is a **Server Component by default**. Add `'use client'` only when you need:
- React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Browser APIs (`window`, `document`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)
- Zustand stores or React Query

```tsx
// ✅ Server Component — no directive needed
export const UserCard = ({ user }: Props) => <div>{user.name}</div>

// ✅ Client Component — directive required
'use client'
export const BetButton = ({ onDrop }: Props) => {
  const isBallAnimating = useGameStore((s) => s.isPlaying)
  return <Button disabled={isBallAnimating} onClick={onDrop}>Drop</Button>
}
```

Never add `'use client'` to a component just because its parent is a client component — Next.js propagates it automatically.

## Export style

Always `export const`, never `export default` (exception: Next.js file conventions — `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` use `export default`):

```tsx
// ✅ slice components
export const BetDetailDrawer = ({ bet, onClose }: Props) => { ... }

// ✅ Next.js pages/layouts — export default is correct here
export default function GamePage() { ... }
```

## Props

Interface is always named `Props`, all fields explicitly typed:

```ts
interface Props {
  value: number
  onClick: () => void
}
```

## Refs — React 19

`forwardRef` is **deprecated in React 19**. `ref` is now a plain prop:

```tsx
// ❌ old pattern — do not use
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => ...)

// ✅ React 19 — ref is just a prop
const Input = ({ ref, ...props }: Props & { ref?: React.Ref<HTMLInputElement> }) => (
  <input ref={ref} {...props} />
)
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

// ✅
<div className="text-red-500 mt-2">...</div>
<div className={cn('base', isActive && 'text-green-500')}>...</div>
```

If a color or value isn't in Tailwind — add it as a CSS variable in `globals.css` and use it via a semantic class.

## shadcn/ui first — NEVER use native HTML primitives

NEVER use native HTML elements when a shadcn component exists:

```tsx
// ❌ FORBIDDEN — always blocked by pre-commit
<button onClick={...}>Click</button>
<img src={...} />

// ✅ REQUIRED
<Button variant="icon" onClick={...}>Click</Button>
<Image src={...} alt={...} fill />
```

**`<button>` → `Button` mapping:**
- Icon-only action → `variant="icon"`, `size="icon-xs"` / `size="icon"`
- Toggle tab option → `variant="betModeOption"`, `size="none"`
- Drop zone / custom shape → `variant="ghost"`, `size="none"` + `className`
- Inside `DialogClose render={...}` → `render={<Button variant="icon" size="none" />}`
- Need a new style? Add a `cva` variant to `src/shared/ui/button.tsx` — do NOT use native `<button>`

## Accessibility

Every interactive element must be keyboard-accessible and have a label:

```tsx
// ❌
<Button onClick={onClose}><X /></Button>

// ✅
<Button onClick={onClose} aria-label="Close dialog"><X /></Button>
```

- Icon-only buttons **must** have `aria-label`
- Use semantic HTML inside Server Components (`<nav>`, `<main>`, `<section>`, `<header>`)
- `Dialog` / `DialogPopup` must have `DialogTitle` and `DialogDescription` (even if visually hidden)

## Size limit

If a component exceeds ~120 lines or contains multiple independent visual blocks — split into sub-components, one file each.
