interface LevelInput {
  level: number;
  xp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpIntoCurrentLevel: number;
}

interface LevelProgress {
  percent: number;
  xpToNext: number;
}

const PERCENT_MAX = 100;

export const levelProgress = (input: LevelInput): LevelProgress => {
  const span = input.xpForNextLevel - input.xpForCurrentLevel;
  const percent =
    span > 0
      ? Math.min(PERCENT_MAX, Math.floor((input.xpIntoCurrentLevel / span) * PERCENT_MAX))
      : 0;
  const xpToNext = Math.max(0, input.xpForNextLevel - input.xp);
  return { percent, xpToNext };
};

export const missionPercent = (progress: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min(PERCENT_MAX, Math.floor((progress / target) * PERCENT_MAX));
};

export const formatMemberSince = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};
