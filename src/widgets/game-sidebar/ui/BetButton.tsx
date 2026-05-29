import { memo } from 'react';
import { Button } from '@/shared/ui/button';
import { BET_MODES, type BetMode } from '@/shared/config';
import { LABELS, ZERO } from '../model/constants';

interface Props {
  mode: BetMode;
  isAutoBetting: boolean;
  disabled: boolean;
  limitNumBets: number;
  currentBetCount: number;
  formId?: string;
  className?: string;
}

const BetButtonInner = ({
  mode,
  isAutoBetting,
  disabled,
  limitNumBets,
  currentBetCount,
  formId,
  className,
}: Props) => {
  const renderContent = () => {
    if (mode === BET_MODES.AUTO) {
      if (isAutoBetting) {
        if (limitNumBets > ZERO) {
          return `${LABELS.STOP} (${currentBetCount}/${limitNumBets})`;
        }
        return `${LABELS.STOP} (${currentBetCount})`;
      }
      return LABELS.START_AUTO_BET;
    }

    return LABELS.BET;
  };

  return (
    <Button
      type="submit"
      form={formId}
      variant={mode === BET_MODES.AUTO && isAutoBetting ? 'destructive' : 'primary'}
      disabled={disabled}
      className={className}
    >
      {renderContent()}
    </Button>
  );
};

export const BetButton = memo(BetButtonInner);
