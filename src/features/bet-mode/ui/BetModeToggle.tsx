'use client';

import { BET_MODES, type BetMode } from '@/shared/config';

interface Props {
  value: BetMode;
  onChange: (value: BetMode) => void;
  disabled?: boolean;
}

export const BetModeToggle = ({ value, onChange, disabled }: Props) => {
  return (
    <div
      className={`relative flex w-full h-[36px] shrink-0 bg-[#0F1419] rounded-[14px] p-[3px]${disabled ? ' opacity-50 pointer-events-none' : ''}`}
    >
      <div
        className="absolute top-[3px] bottom-[3px] rounded-[11px] bg-[#262626]/30 border border-[#262626]/50 border-t-[#262626] transition-transform duration-300 ease-in-out"
        style={{
          left: '3px',
          width: 'calc(50% - 3px)',
          transform: value === BET_MODES.AUTO ? 'translateX(100%)' : 'translateX(0)',
        }}
      />
      {([BET_MODES.MANUAL, BET_MODES.AUTO] as BetMode[]).map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => !disabled && onChange(mode)}
          disabled={disabled}
          className={`relative z-10 flex-1 rounded-[11px] text-[14px] font-medium leading-[20px] tracking-[-0.15px] transition-colors duration-300 ease-in-out ${
            value === mode ? 'text-[#FAFAFA]' : 'text-[#A1A1A1] hover:text-[#FAFAFA]'
          }`}
        >
          {mode === BET_MODES.MANUAL ? 'Manual' : 'Auto'}
        </button>
      ))}
    </div>
  );
};
