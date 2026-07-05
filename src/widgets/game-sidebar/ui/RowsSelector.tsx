import { memo } from 'react';
import { Label } from '@/shared/ui/label';
import { Slider } from '@/shared/ui/slider';

const LABELS = {
  TITLE: 'Rows',
} as const;

const CONFIG = {
  SLIDER_STEP: 1,
} as const;

interface Props {
  rows: number;
  min: number;
  max: number;
  onChange: (val: number | readonly number[]) => void;
  disabled: boolean;
}

const RowsSelectorInner = ({ rows, min, max, onChange, disabled }: Props) => {
  return (
    <div className="flex flex-col gap-3 shrink-0">
      <div className="flex items-center justify-between">
        <Label>{LABELS.TITLE}</Label>
        <span className="flex items-center justify-center w-[42px] h-[30px] rounded-[10px] border border-panel-border bg-panel-dark text-[14px] font-bold leading-[20px] tracking-[-0.15px] text-success">
          {rows}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        value={[rows]}
        onValueChange={onChange}
        step={CONFIG.SLIDER_STEP}
        disabled={disabled}
        thumbClassName={rows !== min ? '-ml-[5px]' : undefined}
      />
      <div className="flex justify-between text-xs text-white/30">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export const RowsSelector = memo(RowsSelectorInner);
