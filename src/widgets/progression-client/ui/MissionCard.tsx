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
  CLAIMED: <CheckCircle className="h-4 w-4 text-[#00C950]" />,
  LOCKED: <Lock className="h-4 w-4 text-[#99A1AF]" />,
};

export const MissionCard = ({ mission, isClaiming, onClaim }: Props) => {
  const percent = missionPercent(mission.progress, mission.target);
  const statusIcon = STATUS_ICON[mission.status] ?? <Zap className="h-4 w-4 text-[#51A2FF]" />;

  return (
    <div className="rounded-[10px] border border-[#2A2F3E] bg-[#1A1F2E] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {statusIcon}
            <p className="text-xs sm:text-sm font-semibold text-white truncate">{mission.title}</p>
          </div>
          <p className="text-[10px] sm:text-xs text-[#99A1AF] mb-3">{mission.description}</p>

          <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#99A1AF] mb-1">
            <span>
              {mission.progress} / {mission.target}
            </span>
            <span>{percent}%</span>
          </div>
          <ProgressBar percent={percent} className="h-1.5" />
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-[#00C950]">
            <CurrencyIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {formatCredits(mission.creditReward)}
          </span>
          <span className="text-[10px] sm:text-xs text-[#51A2FF]">+{mission.xpReward} XP</span>

          {mission.claimable && (
            <Button
              size="none"
              disabled={isClaiming}
              onClick={() => onClaim(mission.id)}
              className="h-7 rounded-[4px] bg-[#00C950] px-3 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isClaiming ? '...' : 'Claim'}
            </Button>
          )}

          {mission.status === 'CLAIMED' && <span className="text-xs text-[#99A1AF]">Claimed</span>}
        </div>
      </div>
    </div>
  );
};
