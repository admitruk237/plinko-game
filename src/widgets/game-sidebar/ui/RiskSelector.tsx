import type { Risk } from '@/entities/game';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { RISK_LEVELS } from '@/shared/config';

const RISK_ACTIVE_CLASSES: Record<Risk, string> = {
  [RISK_LEVELS.LOW]:
    'data-[active=true]:bg-[#00C950]/20 data-[active=true]:border-[#00C950] data-[active=true]:text-[#00C950] data-[active=true]:focus-visible:border-[#00C950]',
  [RISK_LEVELS.MEDIUM]:
    'data-[active=true]:bg-[#F0B100]/20 data-[active=true]:border-[#F0B100] data-[active=true]:text-[#F0B100] data-[active=true]:focus-visible:border-[#F0B100]',
  [RISK_LEVELS.HIGH]:
    'data-[active=true]:bg-[#FB2C36]/20 data-[active=true]:border-[#FB2C36] data-[active=true]:text-[#FB2C36] data-[active=true]:focus-visible:border-[#FB2C36]',
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

export const RiskSelector = ({ risks, currentRisk, onChange, disabled }: Props) => {
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
