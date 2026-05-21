'use client';

import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { BET_MODES, type BetMode } from '@/shared/config';

interface Props {
  value: BetMode;
  onChange: (value: BetMode) => void;
  disabled?: boolean;
}

export const BetModeToggle = ({ value, onChange, disabled }: Props) => {
  return (
    <Tabs
      value={value}
      onValueChange={(val) => !disabled && onChange(val as BetMode)}
      className="w-full shrink-0"
    >
      <TabsList variant="toggle" className={disabled ? 'opacity-50 pointer-events-none' : ''}>
        <TabsTrigger value={BET_MODES.MANUAL} variant="toggle" disabled={disabled}>
          Manual
        </TabsTrigger>
        <TabsTrigger value={BET_MODES.AUTO} variant="toggle" disabled={disabled}>
          Auto
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
