# Auth (Login + Register) — Design Spec

**Date:** 2026-05-18
**Status:** Approved
**Scope:** Login та Register сторінки з JWT auth через backend `https://plinko-be-stanish.fly.dev`

---

## 1. Маршрути

| Path | Доступ | Поведінка |
|---|---|---|
| `/` | Public | Редірект → `/login` або `/game` (залежно від сесії) |
| `/login` | Public | Форма входу |
| `/register` | Public | Форма реєстрації |
| `/game`, `/history`, `/fair` | Protected | Редірект → `/login` якщо нема сесії |

---

## 2. Структура файлів (FSD)

```
src/
  shared/
    api/
      client.ts          ← fetch-wrapper: base URL, Bearer header
      auth.api.ts        ← login / register / logout / refresh функції
    lib/
      session.ts         ← createSession / deleteSession через next/headers cookies()
  entities/
    session/
      model/
        store.ts         ← Zustand: accessToken, user, setSession, clearSession
        types.ts         ← User, SessionState інтерфейси
  features/
    auth/
      actions/
        login.action.ts    ← Server Action: виклик backend + set httpOnly cookie
        register.action.ts ← Server Action: виклик backend + set httpOnly cookie
        logout.action.ts   ← Server Action: виклик backend + delete cookie
      model/
        schemas.ts         ← zod: loginSchema, registerSchema
      ui/
        AuthCard.tsx       ← shared обгортка (logo, title, footer)
        LoginForm.tsx      ← форма входу (react-hook-form)
        RegisterForm.tsx   ← форма реєстрації (react-hook-form)
  middleware.ts            ← захист роутів через refreshToken cookie
  app/
    providers/
      SessionProvider.tsx  ← client component: ініціалізує Zustand з accessToken
    layout.tsx             ← Server Component: refresh → передає accessToken у SessionProvider
    page.tsx               ← redirect → /login або /game
    login/
      page.tsx             ← рендерить <LoginForm />
    register/
      page.tsx             ← рендерить <RegisterForm />
```

---

## 3. Auth Flow

### Login
1. Користувач заповнює email + password → `LoginForm` (client component)
2. `handleSubmit` викликає Server Action `loginAction(formData)`
3. Server Action → `POST /api/v1/auth/login { email, password }`
4. Відповідь: `{ accessToken, refreshToken }`
5. Server Action:
   - `cookies().set('refreshToken', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })`
   - повертає `{ accessToken, user }` клієнту
6. Клієнт зберігає `accessToken` в Zustand `useSessionStore`
7. `redirect('/game')`

### Register
1. Аналогічно login, але `POST /api/v1/auth/register`
2. Відповідь: `{ user: { id, email }, accessToken, refreshToken }`
3. Той самий flow збереження + redirect

### Logout
1. Server Action `logoutAction()`:
   - `POST /api/v1/auth/logout` (Bearer accessToken)
   - `cookies().delete('refreshToken')`
2. Клієнт: `useSessionStore.clearSession()`
3. `redirect('/login')`

### Token Refresh
- При 401 з backend: Server Action або Route Handler викликає `POST /api/v1/auth/refresh { refreshToken }`
- Новий `accessToken` повертається клієнту → оновлюється в Zustand
- Якщо refresh теж 401 → `logoutAction()`

---

## 4. Token Storage

| Токен | Де | Як |
|---|---|---|
| `accessToken` | Zustand (in-memory) | Зникає при refresh сторінки → відновлюється через refresh flow |
| `refreshToken` | httpOnly cookie | `cookies()` з `next/headers`, недоступний JS |

### Hydration при перезавантаженні сторінки

```
Browser refresh
  → middleware перевіряє refreshToken cookie
  → є cookie → NextResponse.next()
  → root layout (Server Component):
      1. читає refreshToken з cookies()
      2. POST /api/v1/auth/refresh { refreshToken }
      3a. Успіх → отримує новий accessToken
          → рендерить <SessionProvider accessToken={...}>
          → SessionProvider (client) ініціалізує Zustand
          → рендерить сторінку (/game або /history тощо)
      3b. Невдача (401) → redirect('/login')
  → нема cookie → middleware redirect('/login')
```

`SessionProvider` — тонкий client component в `app/layout.tsx` який при mount викликає `useSessionStore.setSession(accessToken)`.

Таким чином сторінка відмальовується тільки після того як отримано валідний accessToken.

---

## 5. Middleware

```ts
// middleware.ts
const protectedRoutes = ['/game', '/history', '/fair']
const publicRoutes = ['/login', '/register', '/']

// Перевіряє наявність refreshToken cookie
// Protected без cookie → redirect /login
// Public з cookie → redirect /game
```

---

## 6. Zod Схеми

```ts
// loginSchema
{ email: z.string().email(), password: z.string().min(1) }

// registerSchema
{
  email: z.string().email(),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[a-zA-Z]/, 'Must contain a letter')
    .regex(/[0-9]/, 'Must contain a digit')
}
```

---

## 7. UI (по дизайну)

### Обидві сторінки
- Фон: темний `bg-[#0f1117]`, full-screen centered
- Картка: `bg-[#1a1f2e]`, `rounded-xl`, subtle border, padding `p-8`
- Лого: зелений кружок з SVG target іконкою (Plinko)
- Title: білий bold `text-2xl`
- Subtitle: сірий `text-sm text-muted-foreground`

### Login
- Subtitle: "Welcome back!"
- Fields: Email, Password (shadcn `<Input>`)
- Button: "Sign In" — зелена, full-width (shadcn `<Button>`)
- Link: "Don't have an account? **Sign Up**" → `/register`

### Register
- Subtitle: "Create your account"
- Fields: Email, Password + hint "At least 8 characters with a letter and digit"
- Button: "Create Account" — зелена, full-width
- Link: "Already have an account? **Sign In**" → `/login`

### Спільне
- Shadcn `<Form>`, `<FormField>`, `<FormMessage>` для inline помилок
- Footer: "By continuing, you agree to our Terms and Privacy Policy" (сірий, дрібний)

---

## 8. Error Handling

| HTTP | UX |
|---|---|
| 401 (login) | Inline: "Invalid credentials" під формою |
| 409 (register) | Inline: "Email already registered" під email полем |
| 5xx | Toast: "Server error, try again" |
| Network | Toast: "Connection lost" |

---

## 9. Залежності для встановлення

```bash
npm install react-hook-form @hookform/resolvers zod
```

Shadcn компоненти: `form`, `input`, `button`, `label`

---

## 10. Відкриті питання

1. **CORS** — backend ще не має CORS для FE origin. Потрібна координація перед deploy.
2. **refreshToken cookie backend** — backend повертає refreshToken в JSON body, не як httpOnly cookie. Тому ми самі ставимо cookie в Server Action.
