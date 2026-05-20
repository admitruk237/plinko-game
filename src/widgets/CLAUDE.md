# Layer: widgets

Complex UI blocks composed from features and entities — ready-to-place sections of a page.

## Structure

```
widgets/
  game-board/
    ui/
      GameBoard.tsx
    index.ts
```

## Rules

- Widgets compose features and entities into a cohesive UI block; they contain no standalone business logic
- A widget is justified when the same composed block appears in more than one page, or when it's too large to live inside a page component
- MUST NOT import from `pages/` or `app/`
- Pass data down via props or read from stores — do not create new stores inside widgets
- Export only the top-level component through `index.ts`
