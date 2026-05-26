'use client';

import { Header, BottomNav } from '@/widgets';
import { LoadingState, ErrorState } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { useProfileClient } from './model/useProfileClient';
import { ProfileCard } from './ui/ProfileCard';
import { ProfileStatCard } from './ui/ProfileStatCard';

const LOADING_MESSAGE = 'Loading profile...';
const ERROR_MESSAGE = 'Failed to load profile';

export const ProfileClient = () => {
  const {
    profile,
    isLoading,
    isError,
    balanceDisplay,
    levelPercent,
    totalXp,
    memberSince,
    nickname,
    avatar,
  } = useProfileClient();

  if (isLoading) return <LoadingState message={LOADING_MESSAGE} />;
  if (isError || !profile) return <ErrorState message={ERROR_MESSAGE} />;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <Header title="Profile" showBackButton backRoute={ROUTES.GAME} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[896px] flex-col gap-4 p-4">
          <ProfileCard
            profile={profile}
            balanceDisplay={balanceDisplay}
            levelPercent={levelPercent}
            nickname={nickname}
            avatar={avatar}
          />
          <div className="flex gap-4">
            <ProfileStatCard label="Total XP" value={totalXp} />
            <ProfileStatCard label="Member Since" value={memberSince} />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
