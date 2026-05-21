# Layer: shared

**Відповідальність:** Доменно-нейтральні будівельні блоки — UI компоненти, утиліти, API-клієнт, конфігурація.

---

## Структура

```
src/shared/
  ui/             ← shadcn/ui компоненти (base-nova стиль)
  api/            ← BFF клієнт і типи
  lib/            ← утиліти і хелпери
  config/         ← константи, роути, типи конфігу
```

---

## ui/ — shadcn компоненти

| Компонент | Файл | Використання |
|-----------|------|--------------|
| `Button` | `button.tsx` | Variants: `primary`, `icon`, default |
| `Input` | `input.tsx` | Текстові поля |
| `Card` | `card.tsx` | Variants: `sidebar`, default |
| `Dialog` / `DialogPopup` / `DialogTrigger` | `dialog.tsx` | Модальні вікна (base-ui) |
| `Form` / `FormField` / `FormItem` / `FormLabel` / `FormControl` / `FormMessage` | `form.tsx` | react-hook-form інтеграція |
| `Switch` | `switch.tsx` | Toggle |
| `Tabs` / `TabsList` / `TabsTrigger` | `tabs.tsx` | Перемикач режимів |
| `Label` | `label.tsx` | Мітки форм |
| `Separator` | `separator.tsx` | Розділювач |
| `Slider` | `slider.tsx` | Слайдер (rows selector) |
| `CurrencyIcon` | `currency-icon.tsx` | Іконка валюти |
| `SettingsIcon` | `settings-icon.tsx` | Анімована іконка налаштувань (motion/react) |
| `Field` | `field.tsx` | Поле з валідацією |

Всі імпортуються через barrel: `import { Button, Input } from '@/shared/ui'`

---

## api/

### `bff.api.ts` — BFF клієнт (client-side)

Fetch-функції що викликають `/api/*` роути (Next.js BFF), не бекенд напряму.

```ts
bffApi.getGameConfig()           // GET /api/game/config
bffApi.getMe()                   // GET /api/user/me
bffApi.placeBet(dto)             // POST /api/bets
bffApi.getBets({ limit, cursor, rows }) // GET /api/bets
bffApi.logout()                  // POST /api/auth/logout
```

Кидає `BffError(status, message)` якщо response не ok.

### `auth.api.ts` — Auth клієнт (server-side only)

Прямі запити до бекенду — тільки для використання в route handlers і server actions.

### `types.ts` — DTO типи

Всі request/response типи для API. Entity шар re-exportує і розширює ці типи.

---

## lib/

| Файл | Експортує | Призначення |
|------|-----------|-------------|
| `utils.ts` | `cn()` | clsx + tailwind-merge |
| `credits.ts` | `parseCredits`, `formatCredits`, `MIN_BET`, `MAX_BET` | BigInt арифметика для балансу |
| `session.ts` | `get/set/delete AccessToken/RefreshToken` | Cookie ops (server-only) |
| `auth-proxy.ts` | `getValidAccessToken()` | Access token з авто-refresh (server-only) |
| `api-error.ts` | `ApiError` | Базовий клас помилок |
| `multiplier-color.ts` | `getMultiplierColor()` | Колір за множником |
| `risk-styles.ts` | `getRiskStyles()` | Стилі за рівнем ризику |
| `format-date.ts` | `formatDate()` | Форматування дат |

---

## config/

| Файл | Експортує |
|------|-----------|
| `constants.ts` | `DEFAULT_BET_AMOUNT`, `DEFAULT_NUM_BETS`, `BET_MODES`, `RISK_LEVELS`, `DEFAULT_PAGE_LIMIT` |
| `routes.ts` | `ROUTES` — всі шляхи додатку |
| `index.ts` | barrel export |

---

## Залежності

`shared` не імпортує жоден інший шар проекту.
