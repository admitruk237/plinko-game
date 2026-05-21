import React from 'react';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';

const LABELS = {
  NUM_BETS: 'Number of Bets',
  STOP_PROFIT: 'Stop on Profit',
  STOP_LOSS: 'Stop on Loss',
} as const;

const INPUT_TYPE = 'text';

interface Props {
  numBetsInput: string;
  stopProfitInput: string;
  stopLossInput: string;
  isAutoBetting: boolean;
  onNumBetsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStopProfitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStopLossChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AutoBetSettings = ({
  numBetsInput,
  stopProfitInput,
  stopLossInput,
  isAutoBetting,
  onNumBetsChange,
  onStopProfitChange,
  onStopLossChange,
}: Props) => {
  return (
    <>
      <div className="flex flex-col gap-2 shrink-0">
        <Label>{LABELS.NUM_BETS}</Label>
        <Input
          type={INPUT_TYPE}
          value={numBetsInput}
          disabled={isAutoBetting}
          onChange={onNumBetsChange}
          className="bg-[#0f1219] border border-white/10"
        />
      </div>

      <div className="flex gap-3 shrink-0">
        <div className="flex-1 flex flex-col gap-2">
          <Label>{LABELS.STOP_PROFIT}</Label>
          <Input
            type={INPUT_TYPE}
            value={stopProfitInput}
            disabled={isAutoBetting}
            onChange={onStopProfitChange}
            className="bg-[#0f1219] border border-white/10"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <Label>{LABELS.STOP_LOSS}</Label>
          <Input
            type={INPUT_TYPE}
            value={stopLossInput}
            disabled={isAutoBetting}
            onChange={onStopLossChange}
            className="bg-[#0f1219] border border-white/10"
          />
        </div>
      </div>
    </>
  );
};
