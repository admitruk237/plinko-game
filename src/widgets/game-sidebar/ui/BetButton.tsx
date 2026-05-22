import { Button } from '@/shared/ui/button';
import { BET_MODES, type BetMode } from '@/shared/config';
import { LABELS, STYLES, ZERO } from '../model/constants';

interface Props {
  mode: BetMode;
  isAutoBetting: boolean;
  disabled: boolean;
  limitNumBets: number;
  currentBetCount: number;
}

export const BetButton = ({
  mode,
  isAutoBetting,
  disabled,
  limitNumBets,
  currentBetCount,
}: Props) => {
  const getButtonClassName = () => {
    if (mode === BET_MODES.AUTO && isAutoBetting) {
      return STYLES.STOP_AUTO_BET_CLASS;
    }
    return '';
  };

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
    <Button type="submit" variant="primary" disabled={disabled} className={getButtonClassName()}>
      {renderContent()}
    </Button>
  );
};
