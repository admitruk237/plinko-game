import { CheckCircle, Lock, Zap } from 'lucide-react';
import { Button, CurrencyIcon, ProgressBar } from '@/shared/ui';
import { formatCredits } from '@/shared/lib/credits';
import { missionPercent } from '@/shared/lib/progression';
import type { MissionDto } from '@/shared/api/types';

interface Props {
  mission: MissionDto;
  isClaiming: boolean;
  onClaim: (id: string) => void;
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  CLAIMED: <CheckCircle className="h-4 w-4 text-success" />,
  LOCKED: <Lock className="h-4 w-4 text-text-muted" />,
};

export const MissionCard = ({ mission, isClaiming, onClaim }: Props) => {
  const percent = missionPercent(mission.progress, mission.target);
  const statusIcon = STATUS_ICON[mission.status] ?? <Zap className="h-4 w-4 text-blue-400" />;

  return (
    <div className="rounded-[10px] border border-panel-border bg-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {statusIcon}
            <p className="text-xs sm:text-sm font-semibold text-white truncate">{mission.title}</p>
          </div>
          <p className="text-[10px] sm:text-xs text-text-muted mb-3">{mission.description}</p>

          <div className="flex items-center justify-between text-[10px] sm:text-xs text-text-muted mb-1">
            <span>
              {mission.progress} / {mission.target}
            </span>
            <span>{percent}%</span>
          </div>
          <ProgressBar percent={percent} className="h-1.5" />
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-success">
            <CurrencyIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {formatCredits(mission.creditReward)}
          </span>
          <span className="text-[10px] sm:text-xs text-blue-400">+{mission.xpReward} XP</span>

          {mission.claimable && (
            <Button
              size="none"
              disabled={isClaiming}
              onClick={() => onClaim(mission.id)}
              className="h-7 rounded-[4px] bg-success px-3 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isClaiming ? '...' : 'Claim'}
            </Button>
          )}

          {mission.status === 'CLAIMED' && <span className="text-xs text-text-muted">Claimed</span>}
        </div>
      </div>
    </div>
  );
};
