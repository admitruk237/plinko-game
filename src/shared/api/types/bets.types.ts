import type { Risk } from './game.types';

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
