export interface ProgressionSummaryDto {
  level: number;
  xp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpIntoCurrentLevel: number;
  dailyStreak: number;
}

export interface ProfileDto {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string;
  balance: string;
  progression: ProgressionSummaryDto;
}

export interface UpdateProfileDto {
  nickname: string;
}
