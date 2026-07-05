import { Flame, Gift } from 'lucide-react';
import { Button, CurrencyIcon } from '@/shared/ui';
import { formatCredits } from '@/shared/lib/credits';

interface Props {
  credits: string;
  xp: number;
  streak: number;
  canClaim: boolean;
  nextClaimAt: string;
  isClaiming: boolean;
  onClaim: () => void;
}

export const DailyRewardCard = ({
  credits,
  xp,
  streak,
  canClaim,
  nextClaimAt,
  isClaiming,
  onClaim,
}: Props) => {
  const nextClaimDisplay = canClaim
    ? null
    : new Date(nextClaimAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="rounded-[10px] border border-panel-border bg-panel p-4 sm:p-[25px]">
      <div className="mb-4 flex items-center gap-2">
        <Gift className="h-5 w-5 text-success" />
        <h2 className="text-sm sm:text-base font-bold text-white">Daily Reward</h2>
        <span className="ml-auto flex items-center gap-1.5 text-xs sm:text-sm text-orange-500">
          <Flame className="h-4 w-4" />
          {streak} day streak
        </span>
      </div>

      <div className="mb-4 flex items-center gap-6">
        <div>
          <p className="text-[10px] sm:text-xs text-text-muted">Credits</p>
          <span className="mt-0.5 flex items-center gap-1.5">
            <CurrencyIcon className="h-4 w-4" />
            <span className="text-sm sm:text-base md:text-lg font-bold text-success">
              {formatCredits(credits)}
            </span>
          </span>
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-text-muted">XP</p>
          <p className="mt-0.5 text-sm sm:text-base md:text-lg font-bold text-white">+{xp}</p>
        </div>
      </div>

      {canClaim ? (
        <Button
          size="none"
          onClick={onClaim}
          disabled={isClaiming}
          className="h-[44px] w-full rounded-[8px] bg-gradient-to-r from-orange-500 to-orange-400 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isClaiming ? 'Claiming...' : 'Claim Daily Reward'}
        </Button>
      ) : (
        <p className="text-center text-sm text-text-muted">
          Next reward available at {nextClaimDisplay}
        </p>
      )}
    </div>
  );
};
