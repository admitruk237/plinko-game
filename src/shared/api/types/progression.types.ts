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
