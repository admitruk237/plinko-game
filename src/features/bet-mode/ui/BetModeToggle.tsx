'use client';

import { memo } from 'react';
import { BET_MODES, type BetMode } from '@/shared/config';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

interface Props {
  value: BetMode;
  onChange: (value: BetMode) => void;
  disabled?: boolean;
}

const BetModeToggleInner = ({ value, onChange, disabled }: Props) => {
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
        <Button
          key={mode}
          type="button"
          variant="betModeOption"
          size="none"
          data-active={value === mode}
          disabled={disabled}
          onClick={() => !disabled && onChange(mode)}
        >
          {mode === BET_MODES.MANUAL ? 'Manual' : 'Auto'}
        </Button>
      ))}
    </div>
  );
};

export const BetModeToggle = memo(BetModeToggleInner);
