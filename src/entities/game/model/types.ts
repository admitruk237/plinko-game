import type {
  ActiveSeedResponseDto as ActiveSeedResponse,
  BetListResponseDto as BetListResponse,
  BetResponseDto as BetResponse,
  BetSeedRefDto as BetSeedRef,
  CreateBetDto,
  GameConfigDto as GameConfig,
  RevealedSeedResponseDto as RevealedSeedResponse,
  Risk,
  RotateSeedResponseDto as RotateSeedResponse,
} from '@/shared/api/types';

export type {
  Risk,
  GameConfig,
  BetSeedRef,
  BetResponse,
  BetListResponse,
  CreateBetDto,
  ActiveSeedResponse,
  RevealedSeedResponse,
  RotateSeedResponse,
};

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
  path: string;
  bucketIndex: number;
  startTime: number;
}
