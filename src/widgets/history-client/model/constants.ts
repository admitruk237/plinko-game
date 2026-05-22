import { RISK_LEVELS } from '@/shared/config';

export const FILTER_ALL_VALUE = 'all';
export const DEFAULT_FILTER_VALUE = FILTER_ALL_VALUE;

export const RISK_OPTIONS = [
  { value: FILTER_ALL_VALUE, label: 'All' },
  { value: RISK_LEVELS.LOW, label: 'Low' },
  { value: RISK_LEVELS.MEDIUM, label: 'Medium' },
  { value: RISK_LEVELS.HIGH, label: 'High' },
] as const;

export const MIN_ROWS = 8;
export const MAX_ROWS = 16;

export const ROW_OPTIONS = [
  { value: FILTER_ALL_VALUE, label: 'All' },
  ...Array.from({ length: MAX_ROWS - MIN_ROWS + 1 }, (_, i) => {
    const val = MIN_ROWS + i;
    return { value: val.toString(), label: val.toString() };
  }),
] as const;

export const COLUMN_HEADERS = {
  TIME: 'Time',
  SETTINGS: 'Settings',
  MULTIPLIER: 'Multiplier',
  BET_AMOUNT: 'Bet Amount',
  PAYOUT: 'Payout',
  PROFIT: 'Profit',
  BALANCE_AFTER: 'Balance After',
} as const;

export const MULTIPLIER_SUFFIX = 'x';
export const ROWS_SUFFIX = 'rows';
export const ZERO_VALUE_FALLBACK = '-';
export const SIGN_PLUS = '+';
export const SIGN_MINUS = '-';
export const EMPTY_STRING = '';
export const TIME_CELL_CLASS =
  'text-sm font-normal text-[#D1D5DC] leading-5 tracking-[-0.15px] font-sans';
export const CELL_TEXT_CLASS = TIME_CELL_CLASS;
export const MULTIPLIER_CELL_CLASS =
  'text-[18px] font-bold text-[#33CC66] leading-[28px] tracking-[-0.44px] font-sans';
export const PROFIT_NEG_CLASS =
  'text-sm font-medium text-[#FB2C36] leading-5 tracking-[-0.15px] font-sans';
export const PROFIT_POS_CLASS =
  'text-sm font-medium text-[#00C950] leading-5 tracking-[-0.15px] font-sans';
export const PROFIT_ZERO_CLASS =
  'text-sm font-medium text-gray-400 leading-5 tracking-[-0.15px] font-sans';
export const BALANCE_CELL_CLASS =
  'text-sm font-medium text-[#D1D5DC] leading-5 tracking-[-0.15px] font-sans text-right';
