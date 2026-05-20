---
paths: ["src/app/**"]
---
# Layer: app

Next.js App Router root. Contains routing, global layout, and global styles only.

## Structure

- `layout.tsx` — root layout, fonts, `<html>` / `<body>`, global providers
- `page.tsx` — entry page (delegates to `pages/` layer)
- `globals.css` — Tailwind imports, CSS variables, OKLCH design tokens
- `loading.tsx` / `error.tsx` — Next.js file conventions

## Rules

- All components here are **Server Components by default**
- Add `'use client'` only when hooks, events, or browser APIs are needed
- Do NOT instantiate Zustand stores or use `useState` / `useEffect` in Server Components
- Export `metadata` or `generateMetadata` for SEO — never hardcode `<title>` tags
- Providers that require `'use client'` (e.g. QueryClientProvider) go in a separate `providers.tsx` with the directive, imported into `layout.tsx`
- Do NOT put business logic or game logic here — delegate to `pages/` or `widgets/`
