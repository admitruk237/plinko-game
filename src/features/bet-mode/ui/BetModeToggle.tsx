'use client';

import { BET_MODES, type BetMode } from '@/shared/config';
import { cn } from '@/shared/lib/utils';

interface Props {
  value: BetMode;
  onChange: (value: BetMode) => void;
  disabled?: boolean;
}

export const BetModeToggle = ({ value, onChange, disabled }: Props) => {
  return (
    <div
      className={cn(
        'relative flex w-full h-[36px] shrink-0 bg-panel-dark rounded-[14px] p-[3px]',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      <div
        className={cn(
          'absolute left-[3px] top-[3px] bottom-[3px] w-[calc(50%-3px)] rounded-[11px] bg-neutral-800/30 border border-neutral-800/50 border-t-neutral-800 transition-transform duration-300 ease-in-out',
          value === BET_MODES.AUTO ? 'translate-x-full' : 'translate-x-0'
        )}
      />
      {([BET_MODES.MANUAL, BET_MODES.AUTO] as BetMode[]).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => !disabled && onChange(mode)}
          disabled={disabled}
          className={cn(
            'relative z-10 flex-1 rounded-[11px] text-[14px] font-medium leading-[20px] tracking-[-0.15px] transition-colors duration-300 ease-in-out',
            value === mode ? 'text-neutral-50' : 'text-neutral-400 hover:text-neutral-50'
          )}
        >
          {mode === BET_MODES.MANUAL ? 'Manual' : 'Auto'}
        </button>
      ))}
    </div>
  );
};
