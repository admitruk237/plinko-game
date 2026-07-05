export const DEFAULT_PAGE_LIMIT = 20;
export const DEFAULT_BET_AMOUNT = '1.00';
export const DEFAULT_NUM_BETS = '10';
export const MAX_NUM_BETS = 1000;
export const DEFAULT_STOP_PROFIT = '0.00';
export const DEFAULT_STOP_LOSS = '0.00';
export const DEFAULT_ROWS = 12;
export const BIG_WIN_MULTIPLIER = 5;

export const BET_MODES = {
  MANUAL: 'manual',
  AUTO: 'auto',
} as const;

export type BetMode = (typeof BET_MODES)[keyof typeof BET_MODES];

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;
