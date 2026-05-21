'use client';

import type { BetResult } from '@/entities/game/model/types';
import { multiplierTextColor } from '@/shared/lib/multiplier-color';
import { formatCredits } from '@/shared/lib/credits';

interface Props {
  results: BetResult[];
}

export const RecentResults = ({ results }: Props) => {
  if (results.length === 0) return null;

  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
      {results.map((result, index) => {
        const multiplier = Number(result.multiplier);
        const colorClass = multiplierTextColor(multiplier);

        return (
          <div
            key={result.betId}
            className="flex items-center gap-3 bg-[#1a1e2e]/80 backdrop-blur-sm border border-white/5 rounded-lg px-3 py-2 min-w-[140px] animate-in slide-in-from-right duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-medium tracking-wide">
                Rows {result.rows}
              </span>
              <span className={`text-sm font-bold ${colorClass}`}>{multiplier}x</span>
            </div>
            <span className="text-sm text-white/80 font-medium ml-auto">
              {formatCredits(result.payout)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
