import { TrendingUp } from 'lucide-react';
import { ProgressBar } from '@/shared/ui';

interface Props {
  level: number;
  xpIntoCurrentLevel: number;
  xpForNextLevel: number;
  levelPercent: number;
  totalXp: number;
  dailyStreak: number;
}

export const LevelProgressCard = ({
  level,
  xpIntoCurrentLevel,
  xpForNextLevel,
  levelPercent,
  totalXp,
  dailyStreak,
}: Props) => (
  <div className="rounded-[10px] border border-[#2A2F3E] bg-[#1A1F2E] p-4 sm:p-[25px]">
    <div className="mb-4 flex items-center gap-2">
      <TrendingUp className="h-5 w-5 text-[#51A2FF]" />
      <h2 className="text-sm sm:text-base font-bold text-white">Level Progress</h2>
    </div>

    <div className="mb-2 flex items-end justify-between">
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Level {level}</span>
      <span className="text-xs sm:text-sm text-[#99A1AF]">
        {xpIntoCurrentLevel} / {xpForNextLevel} XP
      </span>
    </div>

    <ProgressBar percent={levelPercent} className="h-3" />

    <div className="mt-4 flex gap-6">
      <div>
        <p className="text-[10px] sm:text-xs text-[#99A1AF]">Total XP</p>
        <p className="mt-0.5 text-sm sm:text-base md:text-lg font-bold text-white">{totalXp}</p>
      </div>
      <div>
        <p className="text-[10px] sm:text-xs text-[#99A1AF]">Daily Streak</p>
        <p className="mt-0.5 text-sm sm:text-base md:text-lg font-bold text-white">
          {dailyStreak} days
        </p>
      </div>
    </div>
  </div>
);
