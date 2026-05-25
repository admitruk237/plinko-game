# Profile & Progression Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the authenticated `/profile` and `/progress` pages wired to the new backend profile/progression endpoints, following FSD layering.

**Architecture:** New BFF route handlers proxy the external API; a `bffApi` client exposes typed calls; `features/profile` and `features/progression` hold react-query hooks + edit/claim logic; `widgets/profile-client` and `widgets/progression-client` compose the UI; pages delegate to widgets. Server state lives in react-query under `['profile']` and `['progression']` — no new Zustand stores.

**Tech Stack:** Next.js 16 (App Router, Route Handlers), React 19, TypeScript strict, @tanstack/react-query 5, react-hook-form + zod, Tailwind v4, shadcn/ui, jest + @testing-library.

**Spec:** `docs/superpowers/specs/2026-05-25-profile-progression-design.md`

**Conventions (read once before starting):**
- Components: `export const`, props interface named `Props`, no logic in JSX (logic → `model/`).
- Imports cross-slice ONLY via public `index.ts`.
- Money: strings in internal units → display via `formatCredits` from `@/shared/lib/credits`. Never `parseFloat`.
- Balance/profile updates after mutations: `queryClient.setQueryData`, never refetch/`setSession`.
- BFF handlers: `getValidAccessToken()`, return `401` if absent, proxy backend status/body as-is.
- Hex colors below come directly from the user's Figma export (permitted by styling rules as user-provided).

---

## Task 1: Add profile & progression DTO types

**Files:**
- Modify: `src/shared/api/types.ts` (append after existing types)

- [ ] **Step 1: Append the new types**

Add to the end of `src/shared/api/types.ts`:

```ts
// ── Profile ─────────────────────────────────────────

export interface ProgressionSummaryDto {
  level: number;
  xp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpIntoCurrentLevel: number;
  dailyStreak: number;
}

export interface ProfileDto {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string;
  balance: string;
  progression: ProgressionSummaryDto;
}

export interface UpdateProfileDto {
  nickname: string;
}

// ── Progression ─────────────────────────────────────

export type MissionStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED';

export interface MissionDto {
  id: string;
  key: string;
  type: string;
  title: string;
  description: string;
  periodKey: string;
  target: number;
  progress: number;
  status: MissionStatus;
  creditReward: string;
  xpReward: number;
  claimable: boolean;
  completedAt: string | null;
  claimedAt: string | null;
}

export interface DailyRewardDto {
  reward: { credits: string; xp: number };
  canClaim: boolean;
  streak: number;
  nextClaimAt: string;
}

export interface ProgressionAggregateDto {
  level: number;
  xp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpIntoCurrentLevel: number;
  daily: DailyRewardDto;
  missions: { daily: MissionDto[]; starter: MissionDto[] };
}

export interface ClaimRewardDto {
  source: string;
  credits: string;
  balanceAfter: string;
  xp: number;
  levelBefore: number;
  levelAfter: number;
  missionId?: string;
  missionKey?: string;
  sourceKey?: string;
  periodKey?: string;
}

export interface ClaimResultDto {
  reward: ClaimRewardDto;
  progression: ProgressionAggregateDto;
}
```

> Note: `MissionStatus` values and the full `ClaimRewardDto` shape are derived from the Swagger examples. Verify against the live backend during implementation; widen/narrow if reality differs.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/shared/api/types.ts
git commit -m "feat(types): add profile and progression DTOs"
```

---

## Task 2: Level-progress and mission-progress helpers (TDD)

**Files:**
- Create: `src/shared/lib/progression.ts`
- Test: `src/shared/lib/progression.test.ts`

- [ ] **Step 1: Write the failing test**

`src/shared/lib/progression.test.ts`:

```ts
import { levelProgress, missionPercent, formatMemberSince } from '@/shared/lib/progression';

describe('levelProgress', () => {
  it('derives percent and xp-to-next within the current level', () => {
    const result = levelProgress({
      level: 1,
      xp: 50,
      xpForCurrentLevel: 0,
      xpForNextLevel: 250,
      xpIntoCurrentLevel: 50,
    });
    expect(result.percent).toBe(20);
    expect(result.xpToNext).toBe(200);
  });

  it('clamps percent to 100 and never returns NaN when span is zero', () => {
    const result = levelProgress({
      level: 9,
      xp: 9000,
      xpForCurrentLevel: 9000,
      xpForNextLevel: 9000,
      xpIntoCurrentLevel: 0,
    });
    expect(result.percent).toBe(0);
    expect(result.xpToNext).toBe(0);
  });
});

describe('missionPercent', () => {
  it('returns floored percent of progress over target', () => {
    expect(missionPercent(0, 5)).toBe(0);
    expect(missionPercent(1, 3)).toBe(33);
    expect(missionPercent(5, 5)).toBe(100);
  });

  it('clamps over-completion and guards zero target', () => {
    expect(missionPercent(7, 5)).toBe(100);
    expect(missionPercent(1, 0)).toBe(0);
  });
});

describe('formatMemberSince', () => {
  it('formats an ISO date to "Month YYYY"', () => {
    expect(formatMemberSince('2026-05-10T12:00:00.000Z')).toBe('May 2026');
  });

  it('returns a dash for invalid input', () => {
    expect(formatMemberSince('not-a-date')).toBe('-');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/shared/lib/progression.test.ts`
Expected: FAIL — cannot find module `@/shared/lib/progression`.

- [ ] **Step 3: Write the implementation**

`src/shared/lib/progression.ts`:

```ts
interface LevelInput {
  level: number;
  xp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpIntoCurrentLevel: number;
}

interface LevelProgress {
  percent: number;
  xpToNext: number;
}

const PERCENT_MAX = 100;

export const levelProgress = (input: LevelInput): LevelProgress => {
  const span = input.xpForNextLevel - input.xpForCurrentLevel;
  const percent =
    span > 0 ? Math.min(PERCENT_MAX, Math.floor((input.xpIntoCurrentLevel / span) * PERCENT_MAX)) : 0;
  const xpToNext = Math.max(0, input.xpForNextLevel - input.xp);
  return { percent, xpToNext };
};

export const missionPercent = (progress: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min(PERCENT_MAX, Math.floor((progress / target) * PERCENT_MAX));
};

export const formatMemberSince = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/shared/lib/progression.test.ts`
Expected: PASS (all 3 describe blocks).

- [ ] **Step 5: Commit**

```bash
git add src/shared/lib/progression.ts src/shared/lib/progression.test.ts
git commit -m "feat(lib): add level/mission progress helpers"
```

---

## Task 3: Shared `ProgressBar` UI component

**Files:**
- Create: `src/shared/ui/progress-bar.tsx`
- Modify: `src/shared/ui/index.ts`

- [ ] **Step 1: Write the component**

`src/shared/ui/progress-bar.tsx`:

```tsx
import { cn } from '@/shared/lib/utils';

interface Props {
  percent: number;
  className?: string;
  fillClassName?: string;
}

const FULL = 100;

export const ProgressBar = ({ percent, className, fillClassName }: Props) => {
  const width = Math.min(FULL, Math.max(0, percent));
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-[#0F1419]', className)}>
      <div
        className={cn(
          'h-full rounded-full bg-gradient-to-r from-[#2B7FFF] to-[#AD46FF]',
          fillClassName
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};
```

- [ ] **Step 2: Export from the barrel**

Append to `src/shared/ui/index.ts`:

```ts
export { ProgressBar } from './progress-bar';
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/progress-bar.tsx src/shared/ui/index.ts
git commit -m "feat(ui): add shared gradient ProgressBar"
```

---

## Task 4: Extend `bffApi` with profile & progression calls

**Files:**
- Modify: `src/shared/api/bff.api.ts`

- [ ] **Step 1: Update imports**

Replace the import block at the top of `src/shared/api/bff.api.ts` with:

```ts
import type {
  BetListResponseDto,
  BetResponseDto,
  ClaimResultDto,
  CreateBetDto,
  GameConfigDto,
  ProfileDto,
  ProgressionAggregateDto,
  UpdateProfileDto,
  UserDto,
} from './types';
```

- [ ] **Step 2: Add the new methods to the `bffApi` object**

Insert these methods inside the `bffApi` object (e.g. before `logout`):

```ts
  getProfile: async (): Promise<ProfileDto> => {
    const res = await fetch('/api/profile/me');
    if (!res.ok) throw new BffError(res.status, 'Failed to fetch profile');
    return res.json();
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<ProfileDto> => {
    const res = await fetch('/api/profile/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new BffError(res.status, error.message || 'Failed to update profile');
    }
    return res.json();
  },

  uploadAvatar: async (file: File): Promise<ProfileDto> => {
    const body = new FormData();
    body.append('image', file);
    const res = await fetch('/api/profile/avatar', { method: 'POST', body });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new BffError(res.status, error.message || 'Failed to upload avatar');
    }
    return res.json();
  },

  getProgression: async (): Promise<ProgressionAggregateDto> => {
    const res = await fetch('/api/progression/me');
    if (!res.ok) throw new BffError(res.status, 'Failed to fetch progression');
    return res.json();
  },

  claimDaily: async (): Promise<ClaimResultDto> => {
    const res = await fetch('/api/progression/daily/claim', { method: 'POST' });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new BffError(res.status, error.message || 'Failed to claim daily reward');
    }
    return res.json();
  },

  claimMission: async (id: string): Promise<ClaimResultDto> => {
    const res = await fetch(`/api/progression/missions/${id}/claim`, { method: 'POST' });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new BffError(res.status, error.message || 'Failed to claim mission');
    }
    return res.json();
  },
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/shared/api/bff.api.ts
git commit -m "feat(api): add profile and progression bff client methods"
```

---

## Task 5: BFF route — `profile/me` (GET + PATCH)

**Files:**
- Create: `src/app/api/profile/me/route.ts`

- [ ] **Step 1: Write the route handler**

`src/app/api/profile/me/route.ts`:

```ts
import { type NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/shared/lib/auth-proxy';

const API_BASE = process.env.API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev';

export async function GET(): Promise<NextResponse> {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(`${API_BASE}/api/v1/profile/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const response = await fetch(`${API_BASE}/api/v1/profile/me`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }
  return NextResponse.json(data);
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/profile/me/route.ts
git commit -m "feat(bff): add profile/me GET and PATCH routes"
```

---

## Task 6: BFF route — `profile/avatar` (POST multipart)

**Files:**
- Create: `src/app/api/profile/avatar/route.ts`

- [ ] **Step 1: Write the route handler**

`src/app/api/profile/avatar/route.ts`:

```ts
import { type NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/shared/lib/auth-proxy';

const API_BASE = process.env.API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const incoming = await req.formData();
  const image = incoming.get('image');
  if (!(image instanceof File)) {
    return NextResponse.json({ error: 'Missing avatar image' }, { status: 400 });
  }

  const forwarded = new FormData();
  forwarded.append('image', image, image.name);

  const response = await fetch(`${API_BASE}/api/v1/profile/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: forwarded,
  });
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }
  return NextResponse.json(data);
}
```

> Do NOT set `Content-Type` manually — `fetch` derives the multipart boundary from the `FormData` body.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/profile/avatar/route.ts
git commit -m "feat(bff): add profile/avatar multipart upload route"
```

---

## Task 7: BFF routes — progression (`me`, `daily/claim`, `missions/[id]/claim`)

**Files:**
- Create: `src/app/api/progression/me/route.ts`
- Create: `src/app/api/progression/daily/claim/route.ts`
- Create: `src/app/api/progression/missions/[id]/claim/route.ts`

- [ ] **Step 1: Write `progression/me`**

`src/app/api/progression/me/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/shared/lib/auth-proxy';

const API_BASE = process.env.API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev';

export async function GET(): Promise<NextResponse> {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(`${API_BASE}/api/v1/progression/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }
  return NextResponse.json(data);
}
```

- [ ] **Step 2: Write `progression/daily/claim`**

`src/app/api/progression/daily/claim/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/shared/lib/auth-proxy';

const API_BASE = process.env.API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev';

export async function POST(): Promise<NextResponse> {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(`${API_BASE}/api/v1/progression/daily/claim`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }
  return NextResponse.json(data);
}
```

- [ ] **Step 3: Write `progression/missions/[id]/claim`**

`src/app/api/progression/missions/[id]/claim/route.ts`:

```ts
import { type NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/shared/lib/auth-proxy';

const API_BASE = process.env.API_BASE_URL ?? 'https://plinko-be-stanish.fly.dev';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const response = await fetch(`${API_BASE}/api/v1/progression/missions/${id}/claim`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }
  return NextResponse.json(data);
}
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/progression
git commit -m "feat(bff): add progression me + daily/mission claim routes"
```

---

## Task 8: Protect `/profile` and `/progress` in middleware

**Files:**
- Modify: `src/proxy.ts:4`

- [ ] **Step 1: Add the routes to `protectedRoutes`**

In `src/proxy.ts`, change line 4 from:

```ts
const protectedRoutes = [ROUTES.GAME, ROUTES.HISTORY];
```

to:

```ts
const protectedRoutes = [ROUTES.GAME, ROUTES.HISTORY, ROUTES.PROFILE, ROUTES.PROGRESS];
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/proxy.ts
git commit -m "feat(auth): guard profile and progress routes in middleware"
```

---

## Task 9: `features/profile` — query + mutation hooks

**Files:**
- Create: `src/features/profile/api/useProfile.ts`
- Create: `src/features/profile/api/useUpdateProfile.ts`
- Create: `src/features/profile/api/useUploadAvatar.ts`
- Create: `src/features/profile/api/index.ts`

- [ ] **Step 1: Write `useProfile`**

`src/features/profile/api/useProfile.ts`:

```ts
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { bffApi, BffError } from '@/shared/api';
import type { ProfileDto } from '@/shared/api/types';
import { useSessionStore } from '@/entities/session';
import { ROUTES } from '@/shared/config';

export const useProfile = () => {
  const router = useRouter();
  const clearSession = useSessionStore((s) => s.clearSession);

  return useQuery<ProfileDto>({
    queryKey: ['profile'],
    queryFn: async (): Promise<ProfileDto> => {
      try {
        return await bffApi.getProfile();
      } catch (err: unknown) {
        if (err instanceof BffError && err.status === 401) {
          clearSession();
          router.push(ROUTES.LOGIN);
        }
        throw err;
      }
    },
    retry: false,
  });
};
```

- [ ] **Step 2: Write `useUpdateProfile`**

`src/features/profile/api/useUpdateProfile.ts`:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bffApi } from '@/shared/api';
import type { ProfileDto, UpdateProfileDto } from '@/shared/api/types';
import type { User } from '@/entities/session';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileDto, Error, UpdateProfileDto>({
    mutationFn: (dto) => bffApi.updateProfile(dto),
    onSuccess: (profile) => {
      queryClient.setQueryData<ProfileDto>(['profile'], profile);
      queryClient.setQueryData<User>(['me'], (old) =>
        old ? { ...old, balance: profile.balance } : old
      );
    },
  });
};
```

- [ ] **Step 3: Write `useUploadAvatar`**

`src/features/profile/api/useUploadAvatar.ts`:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bffApi } from '@/shared/api';
import type { ProfileDto } from '@/shared/api/types';

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileDto, Error, File>({
    mutationFn: (file) => bffApi.uploadAvatar(file),
    onSuccess: (profile) => {
      queryClient.setQueryData<ProfileDto>(['profile'], profile);
    },
  });
};
```

- [ ] **Step 4: Write the api barrel**

`src/features/profile/api/index.ts`:

```ts
export { useProfile } from './useProfile';
export { useUpdateProfile } from './useUpdateProfile';
export { useUploadAvatar } from './useUploadAvatar';
```

- [ ] **Step 5: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/profile/api
git commit -m "feat(profile): add profile query and mutation hooks"
```

---

## Task 10: `features/profile` — `useNicknameEdit` (TDD)

**Files:**
- Create: `src/features/profile/model/schemas.ts`
- Create: `src/features/profile/model/useNicknameEdit.ts`
- Test: `src/features/profile/model/useNicknameEdit.test.ts`

- [ ] **Step 1: Write the nickname schema**

`src/features/profile/model/schemas.ts`:

```ts
import { z } from 'zod';

export const NICKNAME_MIN = 3;
export const NICKNAME_MAX = 20;

export const nicknameSchema = z
  .string()
  .trim()
  .min(NICKNAME_MIN, `Nickname must be at least ${NICKNAME_MIN} characters`)
  .max(NICKNAME_MAX, `Nickname must be at most ${NICKNAME_MAX} characters`)
  .regex(/^[A-Za-z0-9_]+$/, 'Only letters, numbers and underscore allowed');
```

- [ ] **Step 2: Write the failing test**

`src/features/profile/model/useNicknameEdit.test.ts`:

```tsx
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNicknameEdit } from './useNicknameEdit';
import { bffApi } from '@/shared/api';

jest.mock('@/shared/api', () => ({
  bffApi: { updateProfile: jest.fn() },
  BffError: class BffError extends Error {
    constructor(
      public status: number,
      message: string
    ) {
      super(message);
    }
  },
}));

const mockUpdate = bffApi.updateProfile as jest.Mock;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

beforeEach(() => {
  mockUpdate.mockReset();
});

it('starts not editing and seeds the input from the current nickname', () => {
  const { result } = renderHook(() => useNicknameEdit('Player8869'), { wrapper });
  expect(result.current.isEditing).toBe(false);
  act(() => result.current.onEditStart());
  expect(result.current.isEditing).toBe(true);
  expect(result.current.value).toBe('Player8869');
});

it('blocks save and surfaces a validation error for an invalid nickname', async () => {
  const { result } = renderHook(() => useNicknameEdit('Player8869'), { wrapper });
  act(() => result.current.onEditStart());
  act(() => result.current.onChange('ab'));
  await act(async () => {
    await result.current.onSave();
  });
  expect(mockUpdate).not.toHaveBeenCalled();
  expect(result.current.error).toMatch(/at least 3/i);
});

it('maps a 409 response to "Nickname already taken"', async () => {
  const { BffError } = jest.requireMock('@/shared/api');
  mockUpdate.mockRejectedValue(new BffError(409, 'conflict'));
  const { result } = renderHook(() => useNicknameEdit('Player8869'), { wrapper });
  act(() => result.current.onEditStart());
  act(() => result.current.onChange('TakenName'));
  await act(async () => {
    await result.current.onSave();
  });
  expect(result.current.error).toBe('Nickname already taken');
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- src/features/profile/model/useNicknameEdit.test.ts`
Expected: FAIL — cannot find module `./useNicknameEdit`.

- [ ] **Step 4: Write the hook**

`src/features/profile/model/useNicknameEdit.ts`:

```ts
import { useCallback, useState } from 'react';
import { BffError } from '@/shared/api';
import { useUpdateProfile } from '@/features/profile/api';
import { nicknameSchema } from './schemas';

interface NicknameEdit {
  isEditing: boolean;
  value: string;
  error: string | null;
  isPending: boolean;
  onEditStart: () => void;
  onCancel: () => void;
  onChange: (next: string) => void;
  onSave: () => Promise<void>;
}

const CONFLICT = 409;
const BAD_REQUEST = 400;

export const useNicknameEdit = (currentNickname: string): NicknameEdit => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentNickname);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useUpdateProfile();

  const onEditStart = useCallback(() => {
    setValue(currentNickname);
    setError(null);
    setIsEditing(true);
  }, [currentNickname]);

  const onCancel = useCallback(() => {
    setError(null);
    setIsEditing(false);
  }, []);

  const onChange = useCallback((next: string) => {
    setValue(next);
    setError(null);
  }, []);

  const onSave = useCallback(async () => {
    const parsed = nicknameSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid nickname');
      return;
    }
    try {
      await mutateAsync({ nickname: parsed.data });
      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof BffError && err.status === CONFLICT) {
        setError('Nickname already taken');
      } else if (err instanceof BffError && err.status === BAD_REQUEST) {
        setError('Invalid nickname');
      } else {
        setError('Failed to update nickname');
      }
    }
  }, [value, mutateAsync]);

  return { isEditing, value, error, isPending, onEditStart, onCancel, onChange, onSave };
};
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/features/profile/model/useNicknameEdit.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/features/profile/model
git commit -m "feat(profile): add nickname inline-edit hook with validation"
```

---

## Task 11: `features/profile` — `useAvatarUpload` + public barrel

**Files:**
- Create: `src/features/profile/model/useAvatarUpload.ts`
- Create: `src/features/profile/index.ts`

- [ ] **Step 1: Write the hook**

`src/features/profile/model/useAvatarUpload.ts`:

```ts
import { useCallback, useRef } from 'react';
import { useUploadAvatar } from '@/features/profile/api';

interface AvatarUpload {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  onPickAvatar: () => void;
  onAvatarSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useAvatarUpload = (): AvatarUpload => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate, isPending } = useUploadAvatar();

  const onPickAvatar = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onAvatarSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) mutate(file);
      event.target.value = '';
    },
    [mutate]
  );

  return { fileInputRef, isUploading: isPending, onPickAvatar, onAvatarSelect };
};
```

- [ ] **Step 2: Write the public barrel**

`src/features/profile/index.ts`:

```ts
export { useProfile, useUpdateProfile, useUploadAvatar } from './api';
export { useNicknameEdit } from './model/useNicknameEdit';
export { useAvatarUpload } from './model/useAvatarUpload';
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/features/profile/model/useAvatarUpload.ts src/features/profile/index.ts
git commit -m "feat(profile): add avatar upload hook and public api"
```

---

## Task 12: `features/progression` — query + claim hooks

**Files:**
- Create: `src/features/progression/api/useProgression.ts`
- Create: `src/features/progression/api/useClaimDaily.ts`
- Create: `src/features/progression/api/useClaimMission.ts`
- Create: `src/features/progression/api/index.ts`
- Create: `src/features/progression/index.ts`

- [ ] **Step 1: Write `useProgression`**

`src/features/progression/api/useProgression.ts`:

```ts
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { bffApi, BffError } from '@/shared/api';
import type { ProgressionAggregateDto } from '@/shared/api/types';
import { useSessionStore } from '@/entities/session';
import { ROUTES } from '@/shared/config';

export const useProgression = () => {
  const router = useRouter();
  const clearSession = useSessionStore((s) => s.clearSession);

  return useQuery<ProgressionAggregateDto>({
    queryKey: ['progression'],
    queryFn: async (): Promise<ProgressionAggregateDto> => {
      try {
        return await bffApi.getProgression();
      } catch (err: unknown) {
        if (err instanceof BffError && err.status === 401) {
          clearSession();
          router.push(ROUTES.LOGIN);
        }
        throw err;
      }
    },
    retry: false,
  });
};
```

- [ ] **Step 2: Write `useClaimDaily`**

`src/features/progression/api/useClaimDaily.ts`:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bffApi } from '@/shared/api';
import type { ClaimResultDto, ProfileDto, ProgressionAggregateDto } from '@/shared/api/types';
import type { User } from '@/entities/session';

export const useClaimDaily = () => {
  const queryClient = useQueryClient();

  return useMutation<ClaimResultDto, Error, void>({
    mutationFn: () => bffApi.claimDaily(),
    onSuccess: (result) => {
      queryClient.setQueryData<ProgressionAggregateDto>(['progression'], result.progression);
      queryClient.setQueryData<User>(['me'], (old) =>
        old ? { ...old, balance: result.reward.balanceAfter } : old
      );
      queryClient.setQueryData<ProfileDto>(['profile'], (old) =>
        old ? { ...old, balance: result.reward.balanceAfter } : old
      );
    },
  });
};
```

- [ ] **Step 3: Write `useClaimMission`**

`src/features/progression/api/useClaimMission.ts`:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bffApi } from '@/shared/api';
import type { ClaimResultDto, ProfileDto, ProgressionAggregateDto } from '@/shared/api/types';
import type { User } from '@/entities/session';

export const useClaimMission = () => {
  const queryClient = useQueryClient();

  return useMutation<ClaimResultDto, Error, string>({
    mutationFn: (id) => bffApi.claimMission(id),
    onSuccess: (result) => {
      queryClient.setQueryData<ProgressionAggregateDto>(['progression'], result.progression);
      queryClient.setQueryData<User>(['me'], (old) =>
        old ? { ...old, balance: result.reward.balanceAfter } : old
      );
      queryClient.setQueryData<ProfileDto>(['profile'], (old) =>
        old ? { ...old, balance: result.reward.balanceAfter } : old
      );
    },
  });
};
```

- [ ] **Step 4: Write the barrels**

`src/features/progression/api/index.ts`:

```ts
export { useProgression } from './useProgression';
export { useClaimDaily } from './useClaimDaily';
export { useClaimMission } from './useClaimMission';
```

`src/features/progression/index.ts`:

```ts
export { useProgression, useClaimDaily, useClaimMission } from './api';
```

- [ ] **Step 5: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/progression
git commit -m "feat(progression): add progression query and claim hooks"
```

---

## Task 13: `widgets/profile-client` — sub-components

**Files:**
- Create: `src/widgets/profile-client/ui/ProfileAvatar.tsx`
- Create: `src/widgets/profile-client/ui/ProfileStatCard.tsx`

- [ ] **Step 1: Write `ProfileAvatar`**

`src/widgets/profile-client/ui/ProfileAvatar.tsx`:

```tsx
import { Camera } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface Props {
  avatarUrl: string;
  nickname: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  onPickAvatar: () => void;
  onAvatarSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatar = ({
  avatarUrl,
  nickname,
  fileInputRef,
  isUploading,
  onPickAvatar,
  onAvatarSelect,
}: Props) => (
  <div className="relative h-20 w-20 shrink-0">
    <div
      className={cn(
        'flex h-20 w-20 items-center justify-center rounded-full',
        'bg-gradient-to-br from-[#00C950] to-[#009966]'
      )}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={nickname} className="h-20 w-20 rounded-full object-cover" />
      ) : (
        <span className="text-2xl font-bold text-white">
          {nickname.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
    <button
      type="button"
      onClick={onPickAvatar}
      disabled={isUploading}
      aria-label="Change avatar"
      className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#00C950] disabled:opacity-50"
    >
      <Camera className="h-4 w-4 text-white" />
    </button>
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={onAvatarSelect}
    />
  </div>
);
```

- [ ] **Step 2: Write `ProfileStatCard`**

`src/widgets/profile-client/ui/ProfileStatCard.tsx`:

```tsx
interface Props {
  label: string;
  value: string;
}

export const ProfileStatCard = ({ label, value }: Props) => (
  <div className="flex-1 rounded-[10px] border border-[#2A2F3E] bg-[#1A1F2E] p-[17px]">
    <p className="text-xs text-[#99A1AF]">{label}</p>
    <p className="mt-1 text-2xl font-bold text-white">{value}</p>
  </div>
);
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/widgets/profile-client/ui
git commit -m "feat(profile-client): add avatar and stat-card sub-components"
```

---

## Task 14: `widgets/profile-client` — `ProfileCard` + `useProfileClient`

**Files:**
- Create: `src/widgets/profile-client/model/useProfileClient.ts`
- Create: `src/widgets/profile-client/ui/ProfileCard.tsx`

- [ ] **Step 1: Write `useProfileClient`**

`src/widgets/profile-client/model/useProfileClient.ts`:

```ts
import { useProfile, useNicknameEdit, useAvatarUpload } from '@/features/profile';
import { formatCredits } from '@/shared/lib/credits';
import { levelProgress, formatMemberSince } from '@/shared/lib/progression';
import type { ProfileDto } from '@/shared/api/types';

interface ProfileView {
  profile: ProfileDto | undefined;
  isLoading: boolean;
  isError: boolean;
  balanceDisplay: string;
  levelPercent: number;
  totalXp: string;
  memberSince: string;
  nickname: ReturnType<typeof useNicknameEdit>;
  avatar: ReturnType<typeof useAvatarUpload>;
}

export const useProfileClient = (): ProfileView => {
  const { data: profile, isLoading, isError } = useProfile();
  const nickname = useNicknameEdit(profile?.nickname ?? '');
  const avatar = useAvatarUpload();

  const progression = profile?.progression;
  const { percent } = progression
    ? levelProgress(progression)
    : { percent: 0 };

  return {
    profile,
    isLoading,
    isError,
    balanceDisplay: profile ? formatCredits(profile.balance) : '0.00',
    levelPercent: percent,
    totalXp: progression ? String(progression.xp) : '0',
    memberSince: profile ? formatMemberSince(profile.id) : '-',
    nickname,
    avatar,
  };
};
```

> `memberSince` uses `profile.id` only as a placeholder source; the backend profile has no
> `createdAt` field per the spec. During implementation, confirm whether `profile/me` returns a
> creation date — if so, format that field instead. If not, fall back to `'-'` and drop the
> "Member Since" card or hide it.

- [ ] **Step 2: Write `ProfileCard`**

`src/widgets/profile-client/ui/ProfileCard.tsx`:

```tsx
import { Pencil, Trophy, Flame, TrendingUp } from 'lucide-react';
import { Button, Input, CurrencyIcon, ProgressBar } from '@/shared/ui';
import type { ProfileDto } from '@/shared/api/types';
import type { useNicknameEdit, useAvatarUpload } from '@/features/profile';
import { ProfileAvatar } from './ProfileAvatar';

interface Props {
  profile: ProfileDto;
  balanceDisplay: string;
  levelPercent: number;
  nickname: ReturnType<typeof useNicknameEdit>;
  avatar: ReturnType<typeof useAvatarUpload>;
}

export const ProfileCard = ({ profile, balanceDisplay, levelPercent, nickname, avatar }: Props) => (
  <div className="flex flex-col gap-6 rounded-[10px] border border-[#2A2F3E] bg-[#1A1F2E] p-[25px]">
    <div className="flex items-start gap-6">
      <ProfileAvatar
        avatarUrl={profile.avatarUrl}
        nickname={profile.nickname}
        fileInputRef={avatar.fileInputRef}
        isUploading={avatar.isUploading}
        onPickAvatar={avatar.onPickAvatar}
        onAvatarSelect={avatar.onAvatarSelect}
      />

      <div className="flex-1">
        <div className="flex items-center gap-2">
          {nickname.isEditing ? (
            <>
              <Input
                value={nickname.value}
                onChange={(e) => nickname.onChange(e.target.value)}
                className="h-[38px] max-w-[243px]"
              />
              <Button variant="primary" onClick={nickname.onSave} disabled={nickname.isPending}>
                Save
              </Button>
              <Button onClick={nickname.onCancel}>Cancel</Button>
            </>
          ) : (
            <>
              <h1 className="text-lg font-bold text-white">{profile.nickname}</h1>
              <button type="button" aria-label="Edit nickname" onClick={nickname.onEditStart}>
                <Pencil className="h-4 w-4 text-[#99A1AF]" />
              </button>
            </>
          )}
        </div>
        {nickname.error ? <p className="mt-1 text-sm text-red-400">{nickname.error}</p> : null}

        <p className="mt-1 text-sm text-[#99A1AF]">{profile.email}</p>

        <div className="mt-2 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm text-white">
            <Trophy className="h-4 w-4 text-[#F0B100]" /> Level {profile.progression.level}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-white">
            <Flame className="h-4 w-4 text-[#FF6900]" /> {profile.progression.dailyStreak} day streak
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <p className="text-xs text-[#99A1AF]">Balance</p>
        <span className="flex items-center gap-1.5">
          <CurrencyIcon className="h-5 w-5" />
          <span className="text-xl font-bold text-[#00C950]">{balanceDisplay}</span>
        </span>
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm text-white">
          <TrendingUp className="h-4 w-4 text-[#51A2FF]" /> Level {profile.progression.level} Progress
        </span>
        <span className="text-xs text-[#99A1AF]">
          {profile.progression.xpIntoCurrentLevel} / {profile.progression.xpForNextLevel} XP
        </span>
      </div>
      <ProgressBar percent={levelPercent} className="h-2" />
    </div>
  </div>
);
```

> Confirm `CurrencyIcon` accepts a `className` prop; if not, wrap it in a sized `span`.

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/widgets/profile-client/model src/widgets/profile-client/ui/ProfileCard.tsx
git commit -m "feat(profile-client): add ProfileCard and orchestration hook"
```

---

## Task 15: `widgets/profile-client` — `ProfileClient` + barrel + page

**Files:**
- Create: `src/widgets/profile-client/ProfileClient.tsx`
- Create: `src/widgets/profile-client/index.ts`
- Modify: `src/widgets/index.ts`
- Modify: `src/app/profile/page.tsx`

- [ ] **Step 1: Write `ProfileClient`**

`src/widgets/profile-client/ProfileClient.tsx`:

```tsx
'use client';

import { Header } from '@/widgets/header/Header';
import { BottomNav } from '@/widgets/bottom-nav/BottomNav';
import { LoadingState, ErrorState } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { useProfileClient } from './model/useProfileClient';
import { ProfileCard } from './ui/ProfileCard';
import { ProfileStatCard } from './ui/ProfileStatCard';

export const ProfileClient = () => {
  const view = useProfileClient();

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <Header title="Profile" showBackButton backRoute={ROUTES.GAME} />
      <div className="flex-1 overflow-y-auto">
        {view.isLoading ? <LoadingState fullScreen /> : null}
        {view.isError ? <ErrorState fullScreen /> : null}
        {view.profile ? (
          <div className="mx-auto flex w-full max-w-[896px] flex-col gap-4 p-4">
            <ProfileCard
              profile={view.profile}
              balanceDisplay={view.balanceDisplay}
              levelPercent={view.levelPercent}
              nickname={view.nickname}
              avatar={view.avatar}
            />
            <div className="flex gap-4">
              <ProfileStatCard label="Total XP" value={view.totalXp} />
              <ProfileStatCard label="Member Since" value={view.memberSince} />
            </div>
          </div>
        ) : null}
      </div>
      <BottomNav />
    </div>
  );
};
```

> Confirm `Header` is exported from `@/widgets` and whether importing it directly is allowed; the
> widgets rule says widget-to-widget imports go through `@/widgets`. Prefer
> `import { Header, BottomNav } from '@/widgets'` if both are exported there. Check
> `src/widgets/index.ts` first and use the barrel form if available.

- [ ] **Step 2: Write the widget barrel**

`src/widgets/profile-client/index.ts`:

```ts
export { ProfileClient } from './ProfileClient';
```

- [ ] **Step 3: Export from the widgets barrel**

Append to `src/widgets/index.ts`:

```ts
export { ProfileClient } from './profile-client';
```

- [ ] **Step 4: Wire the page**

Replace `src/app/profile/page.tsx` with:

```tsx
import { ProfileClient } from '@/widgets';

const ProfilePage = () => <ProfileClient />;

export default ProfilePage;
```

- [ ] **Step 5: Verify it compiles & lints**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/widgets/profile-client src/widgets/index.ts src/app/profile/page.tsx
git commit -m "feat(profile): wire profile page to ProfileClient widget"
```

---

## Task 16: `widgets/progression-client` — constants + Level & Daily cards

**Files:**
- Create: `src/widgets/progression-client/model/constants.ts`
- Create: `src/widgets/progression-client/ui/LevelProgressCard.tsx`
- Create: `src/widgets/progression-client/ui/DailyRewardCard.tsx`

- [ ] **Step 1: Write constants**

`src/widgets/progression-client/model/constants.ts`:

```ts
export const PROGRESSION_LABELS = {
  dailyReward: 'Daily Reward',
  claimNow: 'Claim Now',
  currentStreak: 'Current streak',
  dailyMissions: 'Daily Missions',
  starterMissions: 'Starter Missions',
} as const;

export const MISSION_RESET_LABEL = '11:59 PM';
```

- [ ] **Step 2: Write `LevelProgressCard`**

`src/widgets/progression-client/ui/LevelProgressCard.tsx`:

```tsx
import { TrendingUp } from 'lucide-react';
import { ProgressBar } from '@/shared/ui';

interface Props {
  level: number;
  xpIntoCurrentLevel: number;
  xpForNextLevel: number;
  percent: number;
  xpToNext: number;
}

export const LevelProgressCard = ({
  level,
  xpIntoCurrentLevel,
  xpForNextLevel,
  percent,
  xpToNext,
}: Props) => (
  <div className="rounded-[10px] border border-[#2A2F3E] bg-[#1A1F2E] p-[21px]">
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-base font-bold text-white">
        <TrendingUp className="h-5 w-5 text-[#51A2FF]" /> Level {level}
      </span>
      <span className="text-sm text-[#99A1AF]">
        {xpIntoCurrentLevel} / {xpForNextLevel} XP
      </span>
    </div>
    <ProgressBar percent={percent} className="mt-4 h-2.5" />
    <p className="mt-2 text-xs text-[#99A1AF]">{xpToNext} XP to level {level + 1}</p>
  </div>
);
```

- [ ] **Step 3: Write `DailyRewardCard`**

`src/widgets/progression-client/ui/DailyRewardCard.tsx`:

```tsx
import { Gift, Clock, Zap } from 'lucide-react';
import { Button, CurrencyIcon } from '@/shared/ui';
import { formatCredits } from '@/shared/lib/credits';
import type { DailyRewardDto } from '@/shared/api/types';
import { PROGRESSION_LABELS } from '../model/constants';

interface Props {
  daily: DailyRewardDto;
  availabilityLabel: string;
  isClaiming: boolean;
  onClaimDaily: () => void;
}

export const DailyRewardCard = ({ daily, availabilityLabel, isClaiming, onClaimDaily }: Props) => (
  <div className="rounded-[10px] border border-[#FF6900]/30 bg-gradient-to-br from-[#FF6900]/10 to-[#FB2C36]/10 p-[21px]">
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-base font-bold text-white">
          <Gift className="h-5 w-5 text-[#FF8904]" /> {PROGRESSION_LABELS.dailyReward}
        </span>
        <span className="text-sm text-[#99A1AF]">Day {daily.streak} of 7</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="flex items-center gap-1 text-sm font-medium text-[#FDC700]">
          <CurrencyIcon className="h-4 w-4" /> {formatCredits(daily.reward.credits)}
        </span>
        <span className="text-sm font-medium text-[#51A2FF]">+{daily.reward.xp} XP</span>
      </div>
    </div>

    {daily.canClaim ? (
      <Button
        variant="primary"
        onClick={onClaimDaily}
        disabled={isClaiming}
        className="mt-4 w-full bg-gradient-to-r from-[#FF6900] to-[#FB2C36]"
      >
        {PROGRESSION_LABELS.claimNow}
      </Button>
    ) : (
      <div className="mt-4 flex items-center justify-center gap-2 rounded-[10px] bg-[#2A2F3E]/50 py-2.5 text-sm text-[#99A1AF]">
        <Clock className="h-4 w-4" /> {availabilityLabel}
      </div>
    )}

    <div className="mt-3 flex items-center justify-between border-t border-[#FF6900]/20 pt-3">
      <span className="text-sm text-[#99A1AF]">{PROGRESSION_LABELS.currentStreak}</span>
      <span className="flex items-center gap-1 text-sm font-medium text-[#FF8904]">
        <Zap className="h-4 w-4" /> {daily.streak} days
      </span>
    </div>
  </div>
);
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/widgets/progression-client/model/constants.ts src/widgets/progression-client/ui/LevelProgressCard.tsx src/widgets/progression-client/ui/DailyRewardCard.tsx
git commit -m "feat(progression-client): add level and daily reward cards"
```

---

## Task 17: `widgets/progression-client` — `MissionCard` + `MissionSection`

**Files:**
- Create: `src/widgets/progression-client/ui/MissionCard.tsx`
- Create: `src/widgets/progression-client/ui/MissionSection.tsx`

- [ ] **Step 1: Write `MissionCard`**

`src/widgets/progression-client/ui/MissionCard.tsx`:

```tsx
import { Target, Clock } from 'lucide-react';
import { Button, CurrencyIcon, ProgressBar } from '@/shared/ui';
import { formatCredits } from '@/shared/lib/credits';
import { missionPercent } from '@/shared/lib/progression';
import type { MissionDto } from '@/shared/api/types';
import { MISSION_RESET_LABEL } from '../model/constants';

interface Props {
  mission: MissionDto;
  isClaiming: boolean;
  onClaimMission: (id: string) => void;
}

export const MissionCard = ({ mission, isClaiming, onClaimMission }: Props) => {
  const percent = missionPercent(mission.progress, mission.target);

  return (
    <div className="rounded-[10px] border border-[#2B7FFF]/30 bg-[#2B7FFF]/10 p-[17px]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#2B7FFF]/30 bg-[#2B7FFF]/10">
          <Target className="h-5 w-5 text-[#51A2FF]" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-bold text-white">{mission.title}</p>
          <p className="mt-0.5 text-xs text-[#99A1AF]">{mission.description}</p>

          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#99A1AF]">
                {mission.progress} / {mission.target}
              </span>
              <span className="font-medium text-white">{percent}%</span>
            </div>
            <ProgressBar percent={percent} className="h-1.5" />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-medium text-[#FDC700]">
                <CurrencyIcon className="h-3.5 w-3.5" /> {formatCredits(mission.creditReward)}
              </span>
              <span className="font-medium text-[#51A2FF]">+{mission.xpReward} XP</span>
            </div>

            {mission.claimable ? (
              <Button
                variant="primary"
                onClick={() => onClaimMission(mission.id)}
                disabled={isClaiming}
                className="h-7 px-3 text-xs"
              >
                Claim
              </Button>
            ) : (
              <span className="flex items-center gap-1 text-xs text-[#99A1AF]">
                <Clock className="h-3 w-3" /> {MISSION_RESET_LABEL}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Write `MissionSection`**

`src/widgets/progression-client/ui/MissionSection.tsx`:

```tsx
import type { LucideIcon } from 'lucide-react';
import type { MissionDto } from '@/shared/api/types';
import { MissionCard } from './MissionCard';

interface Props {
  title: string;
  icon: LucideIcon;
  iconClassName: string;
  missions: MissionDto[];
  claimingId: string | null;
  onClaimMission: (id: string) => void;
}

export const MissionSection = ({
  title,
  icon: Icon,
  iconClassName,
  missions,
  claimingId,
  onClaimMission,
}: Props) => (
  <div className="flex flex-col gap-3">
    <h2 className="flex items-center gap-2 text-sm font-bold text-white">
      <Icon className={iconClassName} /> {title}
    </h2>
    <div className="flex flex-col gap-2">
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          isClaiming={claimingId === mission.id}
          onClaimMission={onClaimMission}
        />
      ))}
    </div>
  </div>
);
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/widgets/progression-client/ui/MissionCard.tsx src/widgets/progression-client/ui/MissionSection.tsx
git commit -m "feat(progression-client): add mission card and section"
```

---

## Task 18: `widgets/progression-client` — `useProgressionClient`

**Files:**
- Create: `src/widgets/progression-client/model/useProgressionClient.ts`

- [ ] **Step 1: Write the orchestration hook**

`src/widgets/progression-client/model/useProgressionClient.ts`:

```ts
import { useState, useCallback } from 'react';
import { useProgression, useClaimDaily, useClaimMission } from '@/features/progression';
import { levelProgress } from '@/shared/lib/progression';
import type { ProgressionAggregateDto } from '@/shared/api/types';

const MS_PER_HOUR = 3_600_000;

const buildAvailabilityLabel = (nextClaimAt: string): string => {
  const target = new Date(nextClaimAt).getTime();
  if (Number.isNaN(target)) return 'Available soon';
  const diffHours = Math.max(1, Math.ceil((target - Date.now()) / MS_PER_HOUR));
  return `Available in ${diffHours}h`;
};

interface ProgressionView {
  progression: ProgressionAggregateDto | undefined;
  isLoading: boolean;
  isError: boolean;
  levelPercent: number;
  xpToNext: number;
  availabilityLabel: string;
  isClaimingDaily: boolean;
  claimingMissionId: string | null;
  onClaimDaily: () => void;
  onClaimMission: (id: string) => void;
}

export const useProgressionClient = (): ProgressionView => {
  const { data: progression, isLoading, isError } = useProgression();
  const claimDaily = useClaimDaily();
  const claimMission = useClaimMission();
  const [claimingMissionId, setClaimingMissionId] = useState<string | null>(null);

  const { percent, xpToNext } = progression
    ? levelProgress(progression)
    : { percent: 0, xpToNext: 0 };

  const onClaimDaily = useCallback(() => {
    claimDaily.mutate();
  }, [claimDaily]);

  const onClaimMission = useCallback(
    (id: string) => {
      setClaimingMissionId(id);
      claimMission.mutate(id, { onSettled: () => setClaimingMissionId(null) });
    },
    [claimMission]
  );

  return {
    progression,
    isLoading,
    isError,
    levelPercent: percent,
    xpToNext,
    availabilityLabel: progression ? buildAvailabilityLabel(progression.daily.nextClaimAt) : '',
    isClaimingDaily: claimDaily.isPending,
    claimingMissionId,
    onClaimDaily,
    onClaimMission,
  };
};
```

> `ProgressionAggregateDto` already carries every field `levelProgress` reads (`level`, `xp`,
> `xpForCurrentLevel`, `xpForNextLevel`, `xpIntoCurrentLevel`), so it's passed directly. Passing a
> variable with extra properties (`daily`, `missions`) is allowed by TS structural typing.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/widgets/progression-client/model/useProgressionClient.ts
git commit -m "feat(progression-client): add orchestration hook"
```

---

## Task 19: `widgets/progression-client` — `ProgressionClient` + barrel + page

**Files:**
- Create: `src/widgets/progression-client/ProgressionClient.tsx`
- Create: `src/widgets/progression-client/index.ts`
- Modify: `src/widgets/index.ts`
- Modify: `src/app/progress/page.tsx`

- [ ] **Step 1: Write `ProgressionClient`**

`src/widgets/progression-client/ProgressionClient.tsx`:

```tsx
'use client';

import { Crosshair, Zap } from 'lucide-react';
import { Header, BottomNav } from '@/widgets';
import { LoadingState, ErrorState } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { useProgressionClient } from './model/useProgressionClient';
import { LevelProgressCard } from './ui/LevelProgressCard';
import { DailyRewardCard } from './ui/DailyRewardCard';
import { MissionSection } from './ui/MissionSection';
import { PROGRESSION_LABELS } from './model/constants';

export const ProgressionClient = () => {
  const view = useProgressionClient();

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <Header title="Progression" showBackButton backRoute={ROUTES.GAME} />
      <div className="flex-1 overflow-y-auto">
        {view.isLoading ? <LoadingState fullScreen /> : null}
        {view.isError ? <ErrorState fullScreen /> : null}
        {view.progression ? (
          <div className="mx-auto flex w-full max-w-[896px] flex-col gap-4 p-4">
            <LevelProgressCard
              level={view.progression.level}
              xpIntoCurrentLevel={view.progression.xpIntoCurrentLevel}
              xpForNextLevel={view.progression.xpForNextLevel}
              percent={view.levelPercent}
              xpToNext={view.xpToNext}
            />
            <DailyRewardCard
              daily={view.progression.daily}
              availabilityLabel={view.availabilityLabel}
              isClaiming={view.isClaimingDaily}
              onClaimDaily={view.onClaimDaily}
            />
            <MissionSection
              title={PROGRESSION_LABELS.dailyMissions}
              icon={Crosshair}
              iconClassName="h-4 w-4 text-[#05DF72]"
              missions={view.progression.missions.daily}
              claimingId={view.claimingMissionId}
              onClaimMission={view.onClaimMission}
            />
            <MissionSection
              title={PROGRESSION_LABELS.starterMissions}
              icon={Zap}
              iconClassName="h-4 w-4 text-[#51A2FF]"
              missions={view.progression.missions.starter}
              claimingId={view.claimingMissionId}
              onClaimMission={view.onClaimMission}
            />
          </div>
        ) : null}
      </div>
      <BottomNav />
    </div>
  );
};
```

> If `Header` is NOT exported from `@/widgets`, add `export { Header } from './header/Header';` to
> `src/widgets/index.ts` first (check before assuming). The same applies to `BottomNav`.

- [ ] **Step 2: Write the widget barrel**

`src/widgets/progression-client/index.ts`:

```ts
export { ProgressionClient } from './ProgressionClient';
```

- [ ] **Step 3: Export from the widgets barrel**

Append to `src/widgets/index.ts`:

```ts
export { ProgressionClient } from './progression-client';
```

- [ ] **Step 4: Wire the page**

Replace `src/app/progress/page.tsx` with:

```tsx
import { ProgressionClient } from '@/widgets';

const ProgressPage = () => <ProgressionClient />;

export default ProgressPage;
```

- [ ] **Step 5: Verify it compiles & lints**

Run: `npx tsc --noEmit && npm run lint`
Expected: no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/widgets/progression-client src/widgets/index.ts src/app/progress/page.tsx
git commit -m "feat(progression): wire progress page to ProgressionClient widget"
```

---

## Task 20: Full verification & manual smoke test

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass (including the new `progression` and `useNicknameEdit` suites).

- [ ] **Step 2: Type-check and lint the whole project**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean.

- [ ] **Step 3: Manual smoke test in the browser**

Run: `npm run dev`, log in, then:
- Visit `/profile`: card renders with avatar/initial, nickname, email, level + streak chips, balance, level bar; the two stat cards show below.
- Click the pencil → inline input + Save/Cancel appear; entering `ab` shows a validation error; a valid name saves and exits edit mode.
- Click the camera → file picker opens; selecting an image updates the avatar.
- Visit `/progress`: level card, daily reward card (Claim Now when claimable, else "Available in …"), Daily Missions and Starter Missions sections render with progress bars.
- Claim a claimable mission/daily → balance updates without a full refetch; progression UI reflects the new state.
- While logged out, hitting `/profile` or `/progress` redirects to `/login`.

- [ ] **Step 4: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix(profile-progression): smoke-test fixes"
```

---

## Self-Review Notes (for the implementer)

- **Backend shape risks** (verify against live API, adjust types if needed):
  - `MissionStatus` enum values.
  - Whether `profile/me` returns a creation date for "Member Since" (Task 14 placeholder).
  - Exact `ClaimRewardDto` fields and that `balanceAfter` is present on both claim responses.
- **Shared-UI prop check**: confirm `CurrencyIcon`, `LoadingState`, `ErrorState`, `Header` prop names match usage (`className`, `fullScreen`, `title`/`showBackButton`/`backRoute`). Read each component once before first use.
- **Barrel imports**: prefer `@/widgets` barrel for `Header`/`BottomNav`; add exports there if missing rather than reaching into internal paths.
- **Colors**: all hex values come from the user's Figma export. If the team later tokenizes them in `globals.css`, swap the arbitrary Tailwind values for semantic classes.
