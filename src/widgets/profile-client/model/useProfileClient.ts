import { useProfile, useNicknameEdit, useAvatarUpload } from '@/features/profile';
import { useSessionStore } from '@/entities/session';
import { formatCredits } from '@/shared/lib/credits';
import { levelProgress, formatMemberSince } from '@/shared/lib/progression';
import type { ProfileDto } from '@/shared/api/types';

interface ProfileView {
  profile: ProfileDto | undefined;
  isLoading: boolean;
  isError: boolean;
  balanceDisplay: string;
  levelPercent: number;
  totalXp: string;
  memberSince: string;
  nickname: ReturnType<typeof useNicknameEdit>;
  avatar: ReturnType<typeof useAvatarUpload>;
}

export const useProfileClient = (): ProfileView => {
  const { data: profile, isLoading, isError } = useProfile();
  const createdAt = useSessionStore((s) => s.user?.createdAt);
  const nickname = useNicknameEdit(profile?.nickname ?? '');
  const avatar = useAvatarUpload();

  const progression = profile?.progression;
  const levelPercent = progression ? levelProgress(progression).percent : 0;

  return {
    profile,
    isLoading,
    isError,
    balanceDisplay: profile ? formatCredits(profile.balance) : '0.00',
    levelPercent,
    totalXp: progression ? String(progression.xp) : '0',
    memberSince: createdAt ? formatMemberSince(createdAt) : '-',
    nickname,
    avatar,
  };
};
