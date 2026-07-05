import type {
  BetListResponseDto as BetListResponse,
  BetResponseDto as BetResponse,
  BetSeedRefDto as BetSeedRef,
  CreateBetDto,
  GameConfigDto as GameConfig,
  Risk,
} from '@/shared/api/types';

export type { Risk, GameConfig, BetSeedRef, BetResponse, BetListResponse, CreateBetDto };

export interface BetResult {
  betId: string;
  multiplier: number;
  payout: string;
  path: string;
  bucketIndex: number;
  rows: number;
  risk: Risk;
}

export interface BallAnimation {
  id: string;
  path: string;
  bucketIndex: number;
  startTime: number;
}
