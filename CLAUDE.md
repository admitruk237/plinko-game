- Відповідай українською мовою
- Код пиши англійською
- Пояснюй коротко і по суті
- Якщо задача складна — СПОЧАТКУ склади план, потім код
- Якщо є сумніви — уточнюй, не вигадуй

---

# ⚛️ Tech Stack

- React (functional components only)
- TypeScript (strict mode)
- Zustand
- Tailwind CSS
- Vite

---

# 🚫 Strict TypeScript Rules

- NEVER use `any`
- ALWAYS explicitly type everything
- NO implicit types
- Use `interface` instead of `type`
- All component props MUST be typed
- Props type MUST be named `Props`

Example:
type Props = {
value: number
onClick: () => void
}

---

# 🏗 Architecture (FSD)

- Follow Feature-Sliced Design STRICTLY
- Layers: app / pages / widgets / features / entities / shared
- DO NOT mix layers
- DO NOT import across layers incorrectly
- Business logic MUST NOT be inside UI components
- Move logic to hooks or model

---

# 🧩 Components Rules

- Arrow functional components ONLY (e.g., `export const Component = () => {}`)
- Keep components small and focused
- No heavy logic inside components
- Extract logic into hooks
- Components must be reusable when possible
- DO NOT use React namespace for hooks (e.g., `React.useState`)
- ALWAYS import hooks directly from 'react' (e.g., `import { useState } from 'react'`)

---

# 📦 State Management

- Use Zustand
- Keep store simple and modular
- All state must be fully typed
- Do not duplicate logic between store and components

---

# 🎨 Styling

- Use Tailwind CSS ONLY
- Do NOT use inline styles
- Use clear and readable classnames
- NEVER use hardcoded hex/rgb/hsl colors in components (e.g., text-[#EF4444]) UNLESS manually added by the USER.
- **Respect User Styling**: NEVER revert or overwrite manual UI/UX changes made by the USER (colors, spacing, typography, etc.). If the USER changes a color or a class after your initial implementation, that change is the new "ground truth".
- ALWAYS prioritize the USER's recent manual tweaks over "clean" or "semantic" refactorings.
- ALWAYS use CSS variables or semantic Tailwind classes when possible, but respect manual overrides.

---

# 🔍 Code Quality

- Prefer simple solutions
- Avoid over-engineering
- Avoid code duplication
- Follow project architecture strictly
- NO magic strings or hardcoded string/number literals in code (e.g., `'auto'`, `'manual'`, `'HIGH'`, `12`). Use constants, enums, or configuration files instead.

Before writing code:

- check simplicity
- check architecture
- check types

---

# 🧠 Complex Tasks Rule

If task is complex:

1. DO NOT write code immediately
2. First create implementation plan (in Ukrainian)
3. Then implement step by step

---

# 🔁 Commit Review Mode

When I send a commit:

- Act as a Senior Developer
- Review code strictly
- Find:
  - architecture issues
  - typing issues
  - bad practices
  - performance problems
- Suggest better solutions

---

# 💬 Communication Rules

- If I ask for code → give code without explanation
- If I ask for explanation → be concise
- Якщо я щось питаю або стверджую — СПОЧАТКУ дай відповідь/підтвердження, а вже потім переходь до дій або коду.
- If task is complex → ALWAYS start with a plan

---

# 🚀 Thinking Process

When solving any task:

1. Understand the problem
2. Check project rules
3. Simplify solution
4. Plan if needed
5. Then write code

---

# 🏗 Advanced Architecture & Performance

## 🏗 FSD Orchestration

- **Layer Isolation**: Entities MUST NOT import from other entities.
- **Feature Layer**: Use the `features` layer to coordinate logic between different entities to avoid tight coupling.
- **Shared UI Purity**: Components in `shared/ui` should be generic and free of domain-specific side-effects (like specific sounds or business modals).

## ⚡ React State Management

- **Avoid Cascading Renders**: Do not use `useEffect` to mirror props or external store changes into local state.
- **Render-Phase Synchronization**: Prefer adjusting state during the render phase (detect change -> call `setState` during render) for better performance and to avoid double-renders.
