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
  <div className="rounded-[10px] border border-panel-border bg-panel p-4 sm:p-[25px]">
    <div className="mb-4 flex items-center gap-2">
      <TrendingUp className="h-5 w-5 text-blue-400" />
      <h2 className="text-sm sm:text-base font-bold text-white">Level Progress</h2>
    </div>

    <div className="mb-2 flex items-end justify-between">
      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Level {level}</span>
      <span className="text-xs sm:text-sm text-text-muted">
        {xpIntoCurrentLevel} / {xpForNextLevel} XP
      </span>
    </div>

    <ProgressBar percent={levelPercent} className="h-3" />

    <div className="mt-4 flex gap-6">
      <div>
        <p className="text-[10px] sm:text-xs text-text-muted">Total XP</p>
        <p className="mt-0.5 text-sm sm:text-base md:text-lg font-bold text-white">{totalXp}</p>
      </div>
      <div>
        <p className="text-[10px] sm:text-xs text-text-muted">Daily Streak</p>
        <p className="mt-0.5 text-sm sm:text-base md:text-lg font-bold text-white">
          {dailyStreak} days
        </p>
      </div>
    </div>
  </div>
);
