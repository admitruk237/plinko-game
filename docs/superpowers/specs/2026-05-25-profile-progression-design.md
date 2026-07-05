# Spec: Profile & Progression pages

Date: 2026-05-25
Status: Approved

## Goal

Build two new authenticated pages — **Profile** (`/profile`) and **Progression** (`/progress`) — wired to new backend endpoints. The page shells already exist (delegate-only `BottomNav` placeholders); this spec fills them with real data, hooks, and UI following the existing FSD layering.

## Scope

- Both domains (profile + progression) in one spec; implementation may be staged.
- Avatar upload is **in scope** (file picker + multipart BFF proxy + optimistic `avatarUrl`).
- Server state lives in **react-query** only — no new Zustand stores.

## Backend endpoints (external API)

- `GET /api/v1/profile/me` — profile aggregate (identity + balance + embedded progression summary)
- `PATCH /api/v1/profile/me` — update nickname (`400` invalid, `409` taken)
- `POST /api/v1/profile/avatar` — multipart `image`; returns updated profile (`400`, `502`)
- `GET /api/v1/progression/me` — progression aggregate (level/xp + daily + missions)
- `POST /api/v1/progression/daily/claim` — claim daily bonus (`409` already claimed)
- `POST /api/v1/progression/missions/{id}/claim` — claim mission reward (`404` not found)

## Data state architecture

- New query keys: `['profile']`, `['progression']`. Game's `['me']` stays untouched.
- Overlap handling: `profile/me` and claim responses include `balanceAfter`/`balance`.
  On claim/edit success → `setQueryData` the source key from the response, then sync
  `balance` into `['me']` (and `['profile']` where relevant) — no refetch, per pitfalls.md.
- All monetary values are internal-unit strings → display via `formatCredits`. XP values
  are plain numbers, displayed as-is.

## Types (`shared/api/types.ts`)

```ts
interface ProgressionSummaryDto {
  level: number; xp: number;
  xpForCurrentLevel: number; xpForNextLevel: number; xpIntoCurrentLevel: number;
  dailyStreak: number;
}
interface ProfileDto {
  id: string; email: string; nickname: string; avatarUrl: string;
  balance: string;
  progression: ProgressionSummaryDto;
}
interface UpdateProfileDto { nickname: string }

type MissionStatus = 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED'; // confirm against backend enum
interface MissionDto {
  id: string; key: string; type: string; title: string; description: string;
  periodKey: string; target: number; progress: number; status: MissionStatus;
  creditReward: string; xpReward: number;
  claimable: boolean; completedAt: string | null; claimedAt: string | null;
}
interface DailyRewardDto {
  reward: { credits: string; xp: number };
  canClaim: boolean; streak: number; nextClaimAt: string;
}
interface ProgressionAggregateDto {
  level: number; xp: number;
  xpForCurrentLevel: number; xpForNextLevel: number; xpIntoCurrentLevel: number;
  daily: DailyRewardDto;
  missions: { daily: MissionDto[]; starter: MissionDto[] };
}
interface ClaimResultDto {
  reward: {
    source: string; credits: string; balanceAfter: string;
    xp: number; levelBefore: number; levelAfter: number;
    missionId?: string; missionKey?: string; sourceKey?: string; periodKey?: string;
  };
  progression: ProgressionAggregateDto;
}
```

> The exact `MissionStatus` enum and full `ClaimResultDto.reward` shape are taken from the
> Swagger examples and must be verified against the live backend during implementation.

## BFF routes (`src/app/api/`)

All protected handlers use `getValidAccessToken()`, return `401` when absent, and proxy the
backend status/body as-is. `API_BASE` from `process.env.API_BASE_URL` with fly.dev fallback.

- `profile/me/route.ts` — `GET`, `PATCH` → `/api/v1/profile/me`
- `profile/avatar/route.ts` — `POST`; read incoming `formData`, forward the `image` file as
  multipart to `/api/v1/profile/avatar` (do NOT set `Content-Type` manually)
- `progression/me/route.ts` — `GET`
- `progression/daily/claim/route.ts` — `POST`
- `progression/missions/[id]/claim/route.ts` — `POST` (dynamic `id`)

## BFF client (`shared/api/bff.api.ts`)

- `getProfile(): Promise<ProfileDto>`
- `updateProfile(dto: UpdateProfileDto): Promise<ProfileDto>`
- `uploadAvatar(file: File): Promise<ProfileDto>` (builds `FormData`)
- `getProgression(): Promise<ProgressionAggregateDto>`
- `claimDaily(): Promise<ClaimResultDto>`
- `claimMission(id: string): Promise<ClaimResultDto>`

All throw `BffError(status, message)` on non-ok.

## Features

### `features/profile`
- `api/useProfile.ts` — `useQuery(['profile'])`; on `401` clear session + redirect (mirror `useCurrentUser`)
- `api/useUpdateProfile.ts` — mutation; on success `setQueryData(['profile'])` + sync `balance` into `['me']`
- `api/useUploadAvatar.ts` — mutation; on success `setQueryData(['profile'])` (new `avatarUrl`)
- `model/useNicknameEdit.ts` — inline edit: `isEditing`, `value`, `onEditStart/onCancel/onSave`,
  zod nickname validation, maps `409`→"Nickname already taken", `400`→"Invalid nickname"
- `model/useAvatarUpload.ts` — `fileInputRef`, `onAvatarSelect(file)`, pending state
- `index.ts` — public API

### `features/progression`
- `api/useProgression.ts` — `useQuery(['progression'])`
- `api/useClaimDaily.ts` — mutation → `setQueryData(['progression'], res.progression)` + balance sync into `['me']`/`['profile']`
- `api/useClaimMission.ts` — mutation`(id)` → same pattern
- `index.ts`

## Widgets

### `widgets/profile-client`
- `ProfileClient.tsx` — render-only: `Header` (back → game) + `ProfileCard` + two `ProfileStatCard`
- `model/useProfileClient.ts` — aggregates `useProfile`, `useNicknameEdit`, `useAvatarUpload`,
  derives level-progress %, formatted balance, member-since
- `ui/ProfileCard.tsx` — avatar + nickname (inline edit) + email + level/streak chips + balance + level progress bar
- `ui/ProfileAvatar.tsx` — avatar image or initial fallback + camera button (triggers file input)
- `ui/ProfileStatCard.tsx` — label + value card (Total XP / Member Since)

### `widgets/progression-client`
- `ProgressionClient.tsx` — render-only: `Header` + `LevelProgressCard` + `DailyRewardCard`
  + `MissionSection` (Daily) + `MissionSection` (Starter)
- `model/useProgressionClient.ts` — aggregates `useProgression`, `useClaimDaily`, `useClaimMission`,
  derives per-mission %, "XP to next level", daily availability label
- `ui/LevelProgressCard.tsx` — level title + `x / y XP` + bar + "N XP to level k"
- `ui/DailyRewardCard.tsx` — reward credits/xp + Claim button (when `canClaim`) or
  "Available in …" disabled state + current streak
- `ui/MissionSection.tsx` — section heading + list of `MissionCard`
- `ui/MissionCard.tsx` — icon + title/description + progress + rewards + claim button (when `claimable`) / reset time
- `model/constants.ts` — labels, section configs, icon mapping

## Shared additions

- `shared/ui/progress-bar.tsx` — domain-agnostic gradient bar (`value`, `max`, optional `className`),
  reused in both widgets. Added because the blue→purple gradient bar repeats throughout.
- `shared/lib` helpers: percentage derivation for XP/missions; `formatMemberSince` built on the
  existing `format-date`. Coin amounts rendered via existing `formatCredits`.

## Pages + middleware

- `app/profile/page.tsx` → renders `<ProfileClient/>` (keep `BottomNav`)
- `app/progress/page.tsx` → renders `<ProgressionClient/>` (keep `BottomNav`)
- `src/proxy.ts` — add `ROUTES.PROFILE`, `ROUTES.PROGRESS` to `protectedRoutes`

## UI states

- Loading → `LoadingState` (fullScreen); error → `ErrorState` (fullScreen).
- Header uses `showBackButton` + `backRoute = ROUTES.GAME`; balance lives in the profile card, not the header.

## Decisions

- **Daily timer**: "Available in …" is derived statically from `nextClaimAt` (no live ticking).
- **Mission claim state**: when `claimable === true`, the card shows a Claim button styled like the
  daily-claim button; Figma only shows incomplete (0%) cards, so the claimed/claimable states follow that pattern.
- **No new Zustand stores**; server state stays in react-query.

## Out of scope

- Live countdown ticking for daily reward.
- Surfacing nickname/avatar in the global Header or BottomNav.
- Leaderboards or any progression feature beyond the listed endpoints.
