import { memo } from 'react';
import type { Risk } from '@/entities/game';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { RISK_LEVELS } from '@/shared/config';

const RISK_ACTIVE_CLASSES: Record<Risk, string> = {
  [RISK_LEVELS.LOW]:
    'data-[active=true]:bg-success/20 data-[active=true]:border-success data-[active=true]:text-success data-[active=true]:focus-visible:border-success',
  [RISK_LEVELS.MEDIUM]:
    'data-[active=true]:bg-warning/20 data-[active=true]:border-warning data-[active=true]:text-warning data-[active=true]:focus-visible:border-warning',
  [RISK_LEVELS.HIGH]:
    'data-[active=true]:bg-danger/20 data-[active=true]:border-danger data-[active=true]:text-danger data-[active=true]:focus-visible:border-danger',
} as const;

const LABELS = {
  TITLE: 'Risk',
} as const;

interface Props {
  risks: readonly Risk[];
  currentRisk: Risk;
  onChange: (risk: Risk) => void;
  disabled: boolean;
}

const RiskSelectorInner = ({ risks, currentRisk, onChange, disabled }: Props) => {
  return (
    <div className="flex flex-col gap-3 shrink-0">
      <Label>{LABELS.TITLE}</Label>
      <div className="flex gap-2">
        {risks.map((r) => (
          <Button
            key={r}
            type="button"
            variant="riskOption"
            size="none"
            data-active={currentRisk === r}
            onClick={() => onChange(r)}
            disabled={disabled}
            className={`flex-1 ${RISK_ACTIVE_CLASSES[r]}`}
          >
            {r}
          </Button>
        ))}
      </div>
    </div>
  );
};

export const RiskSelector = memo(RiskSelectorInner);
