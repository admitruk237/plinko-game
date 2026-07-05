---
paths: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/**/__tests__/**"]
---
# Testing Patterns

## What to test

| Layer | Test target | Skip |
|-------|-------------|------|
| `shared/lib` | Pure functions (parseCredits, formatCredits, getRiskStyles) | — |
| `entities/*/model` | Zustand store actions | Store state shape |
| `features/*/model` | Hooks via `renderHook` | Internal state details |
| `features/*/api` | React Query hooks (mock bffApi) | Response shapes |
| `features/*/ui` | User interactions (form submit, click) | Visual layout |
| `widgets` | Integration of features — smoke tests only | CSS, exact text |

Do **not** write tests for: `shared/ui` (shadcn wrappers), `app/` layout, `index.ts` barrels.

## Hook tests — renderHook pattern

```tsx
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
)

it('doubles the bet amount', () => {
  const { result } = renderHook(
    () => useBetForm({ balance: '10000000', disabled: false }),
    { wrapper }
  )
  act(() => result.current.handleDouble())
  expect(result.current.betInput).toBe('2.00')
})
```

## Mocking bffApi

```ts
import { bffApi } from '@/shared/api'

jest.mock('@/shared/api', () => ({
  bffApi: {
    placeBet: jest.fn(),
    getMe:    jest.fn(),
  },
  BffError: class BffError extends Error {
    constructor(public status: number, message: string) { super(message) }
  },
}))

const mockPlaceBet = bffApi.placeBet as jest.Mock

beforeEach(() => {
  mockPlaceBet.mockResolvedValue({
    betId: 'test-id', multiplier: '2.0', payout: '2000000',
    balanceAfter: '12000000', path: 'LRLR', bucketIndex: 2,
    rows: 4, risk: 'LOW', amount: '1000000',
  })
})
```

## Mocking Zustand stores

```ts
import { useGameStore } from '@/entities/game'

jest.mock('@/entities/game', () => ({
  useGameStore: jest.fn(),
}))

const mockUseGameStore = useGameStore as jest.Mock

beforeEach(() => {
  mockUseGameStore.mockReturnValue({
    isPlaying: false,
    setPlaying: jest.fn(),
  })
})
```

## Pure function tests (shared/lib)

```ts
import { parseCredits, formatCredits } from '@/shared/lib/credits'

describe('parseCredits', () => {
  it('converts display string to bigint units', () => {
    expect(parseCredits('1.00')).toBe(1_000_000n)
    expect(parseCredits('0.50')).toBe(500_000n)
  })
})

describe('formatCredits', () => {
  it('converts raw units to display string', () => {
    expect(formatCredits('1000000')).toBe('1.00')
  })
})
```

## File placement

```
src/features/place-bet/model/
  useBetForm.ts
  useBetForm.test.ts       ← co-located, same directory

src/shared/lib/
  credits.ts
  credits.test.ts          ← co-located
```

Use `__tests__/` subdirectory only when a slice has more than 3 test files.

## Rules

- One `describe` per file, one `it` per behaviour (not per function)
- Mock at the module boundary (`jest.mock('@/shared/api')`) — never mock internal helpers
- `act()` around every state mutation in `renderHook`
- Reset mocks in `beforeEach` — never share mock state between tests
