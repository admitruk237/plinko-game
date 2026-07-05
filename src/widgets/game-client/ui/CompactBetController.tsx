'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/shared/ui';
import { BET_MODES } from '@/shared/config';
import { usePlaceBetStore } from '@/features/place-bet';

interface Props {
  onOpenSettings: () => void;
}

const SLIDERS_ICON_SIZE = 18;
const FORM_ID = 'sidebar-form';

export const CompactBetController = ({ onOpenSettings }: Props) => {
  const { betAmount, mode, isAutoBetting, numBetsInput, currentBetCount, rows, risk } =
    usePlaceBetStore(
      useShallow((s) => ({
        betAmount: s.betAmount,
        mode: s.mode,
        isAutoBetting: s.isAutoBetting,
        numBetsInput: s.numBetsInput,
        currentBetCount: s.currentBetCount,
        rows: s.rows,
        risk: s.risk,
      }))
    );
  const limitNumBets = parseInt(numBetsInput, 10) || 0;

  const disabled = false;
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
    <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col gap-3 rounded-[16px] border border-panel-border bg-panel/95 p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm md:hidden">
      <Button
        variant="ghost"
        size="none"
        onClick={onOpenSettings}
        className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80 w-full text-left"
        aria-label="Open bet settings"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-panel-border/40 text-text-muted border border-white/5">
          <SlidersHorizontal size={SLIDERS_ICON_SIZE} />
        </div>
        <span className="text-sm font-medium tracking-wide text-neutral-300">
          {betAmount} • {String(risk).toUpperCase()} • {rows} rows
        </span>
      </Button>

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
