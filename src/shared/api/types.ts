// API request/response types used by shared/api layer.
// Entities re-export and extend these types for domain use.

export type Risk = 'LOW' | 'MEDIUM' | 'HIGH';

// ── User ────────────────────────────────────────────

export interface UserDto {
  id: string;
  email: string;
  balance: string;
  createdAt: string;
}

// ── Game Config ─────────────────────────────────────

export interface GameConfigDto {
  rows: number[];
  risks: Risk[];
  minBet: string;
  maxBet: string;
  payoutTables: Record<Risk, Record<string, number[]>>;
}

// ── Bets ────────────────────────────────────────────

export interface BetSeedRefDto {
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
}

export interface BetResponseDto {
  betId: string;
  amount: string;
  rows: number;
  risk: Risk;
  path: string;
  bucketIndex: number;
  multiplier: string;
  payout: string;
  balanceAfter: string;
  seed: BetSeedRefDto;
  createdAt?: string;
}

export interface BetListResponseDto {
  items: BetResponseDto[];
  nextCursor: string | null;
}

export interface CreateBetDto {
  amount: string;
  rows: number;
  risk: Risk;
}

// ── Seeds ───────────────────────────────────────────

export interface ActiveSeedResponseDto {
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
}

export interface RevealedSeedResponseDto {
  id: string;
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonceMax: number;
}

export interface RotateSeedResponseDto {
  revealed: RevealedSeedResponseDto;
  newActive: ActiveSeedResponseDto;
}

// ── Auth ────────────────────────────────────────────

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponseDto {
  user: Pick<UserDto, 'id' | 'email'>;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}

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
