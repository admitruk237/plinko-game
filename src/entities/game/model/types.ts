import type {
  Risk,
  GameConfigDto as GameConfig,
  BetSeedRefDto as BetSeedRef,
  BetResponseDto as BetResponse,
  BetListResponseDto as BetListResponse,
  CreateBetDto,
  ActiveSeedResponseDto as ActiveSeedResponse,
  RevealedSeedResponseDto as RevealedSeedResponse,
  RotateSeedResponseDto as RotateSeedResponse,
} from '@/shared/api/types'

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
}

export interface BetResult {
  betId: string
  multiplier: number
  payout: string
  path: string
  bucketIndex: number
  rows: number
  risk: Risk
}

export interface BallAnimation {
  path: string
  bucketIndex: number
  startTime: number
}
