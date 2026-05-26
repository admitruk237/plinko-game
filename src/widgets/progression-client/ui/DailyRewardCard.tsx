import { Gift, Flame } from 'lucide-react';
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
    <div className="rounded-[10px] border border-[#2A2F3E] bg-[#1A1F2E] p-[25px]">
      <div className="mb-4 flex items-center gap-2">
        <Gift className="h-5 w-5 text-[#00C950]" />
        <h2 className="text-base font-bold text-white">Daily Reward</h2>
        <span className="ml-auto flex items-center gap-1.5 text-sm text-[#FF6900]">
          <Flame className="h-4 w-4" />
          {streak} day streak
        </span>
      </div>

      <div className="mb-4 flex items-center gap-6">
        <div>
          <p className="text-xs text-[#99A1AF]">Credits</p>
          <span className="mt-0.5 flex items-center gap-1.5">
            <CurrencyIcon className="h-4 w-4" />
            <span className="text-lg font-bold text-[#00C950]">{formatCredits(credits)}</span>
          </span>
        </div>
        <div>
          <p className="text-xs text-[#99A1AF]">XP</p>
          <p className="mt-0.5 text-lg font-bold text-white">+{xp}</p>
        </div>
      </div>

      {canClaim ? (
        <Button
          size="none"
          onClick={onClaim}
          disabled={isClaiming}
          className="h-[44px] w-full rounded-[8px] bg-gradient-to-r from-[#FF6900] to-[#FF9500] text-sm font-semibold text-white disabled:opacity-50"
        >
          {isClaiming ? 'Claiming...' : 'Claim Daily Reward'}
        </Button>
      ) : (
        <p className="text-center text-sm text-[#99A1AF]">
          Next reward available at {nextClaimDisplay}
        </p>
      )}
    </div>
  );
};
