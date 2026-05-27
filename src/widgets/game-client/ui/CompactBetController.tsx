'use client';

import type { Risk } from '@/entities/game';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui';
import { BET_MODES, type BetMode } from '@/shared/config';

interface Props {
  betAmount: string;
  risk: Risk;
  rows: number;
  isAutoBetting: boolean;
  limitNumBets: number;
  currentBetCount: number;
  disabled: boolean;
  mode: BetMode;
  onOpenSettings: () => void;
}

const SLIDERS_ICON_SIZE = 18;
const FORM_ID = 'sidebar-form';

export const CompactBetController = ({
  betAmount,
  risk,
  rows,
  isAutoBetting,
  limitNumBets,
  currentBetCount,
  disabled,
  mode,
  onOpenSettings,
}: Props) => {
  const renderContent = () => {
    if (mode === BET_MODES.AUTO) {
      if (isAutoBetting) {
        if (limitNumBets > 0) {
          return `Stop (${currentBetCount}/${limitNumBets})`;
        }
        return `Stop (${currentBetCount})`;
      }
      return 'Auto Bet';
    }
    return 'Bet';
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col gap-3 rounded-[16px] border border-[#2A2F3E] bg-[#1A1F2E]/95 p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm md:hidden">
      <div
        onClick={onOpenSettings}
        className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2A2F3E]/40 text-[#99A1AF] border border-white/5">
          <SlidersHorizontal size={SLIDERS_ICON_SIZE} />
        </div>
        <span className="text-sm font-medium tracking-wide text-[#D1D5DC]">
          {betAmount} • {String(risk).toUpperCase()} • {rows} rows
        </span>
      </div>

      <Button
        type="submit"
        form={FORM_ID}
        variant={mode === BET_MODES.AUTO && isAutoBetting ? 'destructive' : 'primary'}
        disabled={disabled}
      >
        {renderContent()}
      </Button>
    </div>
  );
};
