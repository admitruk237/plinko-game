# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- Відповідай українською мовою
- Код пиши англійською
- Пояснюй коротко і по суті
- Якщо задача складна — СПОЧАТКУ склади план, потім код
- Якщо є сумніви — уточнюй, не вигадуй

---

# 🛠 Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint check
```

Add shadcn components (auto-installs to `src/shared/ui`):
```bash
npx shadcn@latest add [component-name]
```

> ⚠️ **AGENTS.md warning**: This is Next.js 16 with breaking changes. Read `node_modules/next/dist/docs/` before writing Next.js-specific code.

---

# ⚛️ Tech Stack

- **Next.js 16** (App Router, RSC)
- **React 19** (functional components only)
- **TypeScript** (strict mode)
- **Zustand 5** (with `persist` middleware)
- **Tailwind CSS v4** (OKLCH color system, CSS variables)
- **shadcn/ui** (`base-nova` style, built on `@base-ui/react`)
- **@tanstack/react-query 5**
- **lucide-react** (icons)

---

# 📁 Path Aliases

`@/*` maps to `src/*`. Use it everywhere — no relative `../` climbing.

```ts
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui';
```

shadcn component aliases (from `components.json`):
- `@/shared/ui` — UI components
- `@/shared/lib/utils` — `cn()` utility
- `@/shared/lib/hooks` — custom hooks

---

# 🏗 Architecture (FSD)

Layers (top → bottom, imports go downward only):

```
app       → Next.js App Router (layout, page, globals.css)
pages     → page-level compositions
widgets   → complex UI blocks
features  → interactive features (bets, chat, etc.)
entities  → business entities (session, player) — NEVER import other entities
shared    → generic UI, lib utils, API clients
```

- Business logic MUST NOT be inside UI components → move to hooks or `model/`
- **Layer Isolation**: Entities MUST NOT import from other entities
- **Feature Layer**: coordinate cross-entity logic in `features/`, not in entities
- **Shared UI Purity**: `shared/ui` components must be generic (no game-specific side-effects)

### Next.js App Router specifics

- `src/app/` is the router root — use `layout.tsx` / `page.tsx` / `loading.tsx`
- Server Components by default; add `'use client'` only when needed (hooks, events, browser APIs)
- Do NOT put Zustand stores or `useState` in Server Components

---

# 🚫 Strict TypeScript Rules

- NEVER use `any`
- ALWAYS explicitly type everything
- NO implicit types
- Use `interface` instead of `type`
- All component props MUST be typed and named `Props`

```ts
interface Props {
  value: number;
  onClick: () => void;
}
```

---

# 🧩 Components Rules

- Functional components ONLY
- Keep components small and focused
- Extract logic into hooks
- DO NOT use React namespace for hooks — import directly from `'react'`

```ts
// ✅
import { useState, useEffect } from 'react';
// ❌
React.useState(...)
```

---

# 📦 State Management

- Use Zustand; keep stores modular and fully typed
- Session store (`useSessionStore`) uses `persist` middleware — stored as `'session-storage'`
- Do not duplicate logic between store and components

---

# 🎨 Styling

- Tailwind CSS ONLY — no inline styles
- Colors use **OKLCH** via CSS variables (`--primary`, `--background`, etc.) — use semantic classes, not raw `oklch(...)` values
- NEVER hardcode hex/rgb/hsl/oklch in components UNLESS manually added by the USER
- **Respect User Styling**: NEVER revert manual UI/UX changes by the user — they are ground truth
- Prefer semantic Tailwind classes (`bg-primary`, `text-foreground`) over arbitrary values

---

# 🔍 Code Quality

- Prefer simple solutions; avoid over-engineering
- Avoid code duplication
- Before writing code: check simplicity → check architecture → check types

---

# 🧠 Complex Tasks Rule

If task is complex:

1. DO NOT write code immediately
2. First create implementation plan (in Ukrainian)
3. Then implement step by step

---

# 🔁 Commit Review Mode

When I send a commit — act as a Senior Developer and strictly review:
- Architecture issues
- Typing issues
- Bad practices
- Performance problems

---

# 💬 Communication Rules

- If I ask for code → give code without explanation
- If I ask for explanation → be concise
- Якщо я щось питаю або стверджую — СПОЧАТКУ дай відповідь/підтвердження, а вже потім переходь до дій або коду
- If task is complex → ALWAYS start with a plan

---

# ⚡ Performance

- **Avoid Cascading Renders**: Do not use `useEffect` to mirror props or store changes into local state
- **Render-Phase Synchronization**: Prefer adjusting state during render phase (detect change → call `setState` during render) to avoid double-renders
