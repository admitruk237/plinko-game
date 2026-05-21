# Layer: shared

**Responsibility:** Domain-agnostic building blocks — UI components, utilities, API client, configuration.

---

## Structure

```
src/shared/
  ui/             ← shadcn/ui components (base-nova style)
  api/            ← BFF client and types
  lib/            ← utilities and helpers
  config/         ← constants, routes, config types
```

---

## ui/ — shadcn components

| Component | File | Usage |
|-----------|------|-------|
| `Button` | `button.tsx` | Variants: `primary`, `icon`, default |
| `Input` | `input.tsx` | Text fields |
| `Card` | `card.tsx` | Variants: `sidebar`, default |
| `Dialog` / `DialogPopup` / `DialogTrigger` | `dialog.tsx` | Modals (base-ui) |
| `Form` / `FormField` / `FormItem` / `FormLabel` / `FormControl` / `FormMessage` | `form.tsx` | react-hook-form integration |
| `Switch` | `switch.tsx` | Toggle |
| `Tabs` / `TabsList` / `TabsTrigger` | `tabs.tsx` | Mode switcher |
| `Label` | `label.tsx` | Form labels |
| `Separator` | `separator.tsx` | Divider |
| `Slider` | `slider.tsx` | Slider (rows selector) |
| `CurrencyIcon` | `currency-icon.tsx` | Currency icon |
| `SettingsIcon` | `settings-icon.tsx` | Animated settings icon (motion/react) |
| `Field` | `field.tsx` | Field with validation |

All imported via barrel: `import { Button, Input } from '@/shared/ui'`

---

## api/

### `bff.api.ts` — BFF client (client-side)

Fetch functions calling `/api/*` routes (Next.js BFF), not the backend directly.

```ts
bffApi.getGameConfig()                   // GET /api/game/config
bffApi.getMe()                           // GET /api/user/me
bffApi.placeBet(dto)                     // POST /api/bets
bffApi.getBets({ limit, cursor, rows })  // GET /api/bets
bffApi.logout()                          // POST /api/auth/logout
```

Throws `BffError(status, message)` when response is not ok.

### `auth.api.ts` — Auth client (server-side only)

Direct requests to the backend — only for use in route handlers and server actions.

### `types.ts` — DTO types

All request/response types for the API. The entities layer re-exports and extends these types.

---

## lib/

| File | Exports | Purpose |
|------|---------|---------|
| `utils.ts` | `cn()` | clsx + tailwind-merge |
| `credits.ts` | `parseCredits`, `formatCredits`, `MIN_BET`, `MAX_BET` | BigInt arithmetic for balance |
| `session.ts` | `get/set/delete AccessToken/RefreshToken` | Cookie ops (server-only) |
| `auth-proxy.ts` | `getValidAccessToken()` | Access token with auto-refresh (server-only) |
| `api-error.ts` | `ApiError` | Base error class |
| `multiplier-color.ts` | `getMultiplierColor()` | Color by multiplier value |
| `risk-styles.ts` | `getRiskStyles()` | Styles by risk level |
| `format-date.ts` | `formatDate()` | Date formatting |

---

## config/

| File | Exports |
|------|---------|
| `constants.ts` | `DEFAULT_BET_AMOUNT`, `DEFAULT_NUM_BETS`, `BET_MODES`, `RISK_LEVELS`, `DEFAULT_PAGE_LIMIT` |
| `routes.ts` | `ROUTES` — all app paths |
| `index.ts` | barrel export |

---

## Dependencies

`shared` does not import from any other project layer.
