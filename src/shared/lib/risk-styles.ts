import type { Risk } from '../api/types';

export const RISK_BADGE_STYLES: Record<Risk, string> = {
  LOW: 'bg-green-500/20 text-green-400 border-green-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  HIGH: 'bg-red-500/20 text-red-400 border-red-500/30',
};
