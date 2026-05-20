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

> ⚠️ **Next.js 16 breaking changes**: Read `node_modules/next/dist/docs/` before writing Next.js-specific code.

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

# 🏗 Architecture (FSD)

Layers (top → bottom, imports go downward only):

```
app       → routing, layout, global styles       → see src/app/CLAUDE.md
pages     → page-level compositions
widgets   → complex UI blocks                    → see src/widgets/CLAUDE.md
features  → interactive features                 → see src/features/CLAUDE.md
entities  → business entities and stores         → see src/entities/CLAUDE.md
shared    → generic UI, utils, API clients       → see src/shared/CLAUDE.md
```

> **Before working in any layer** — read its `CLAUDE.md` first. Each file contains layer-specific rules, structure, and constraints that override general guidelines.

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

# 🎨 Styling

- Tailwind CSS ONLY — no inline styles
- Colors use **OKLCH** via CSS variables — use semantic classes (`bg-primary`, `text-foreground`), not raw `oklch(...)` values
- NEVER hardcode hex/rgb/hsl/oklch in components UNLESS manually added by the USER
- **Respect User Styling**: NEVER revert manual UI/UX changes by the user — they are ground truth

---

# 🔍 Code Quality

- Prefer simple solutions; avoid over-engineering
- Avoid code duplication
- NO magic strings or hardcoded literals — use constants or enums
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
