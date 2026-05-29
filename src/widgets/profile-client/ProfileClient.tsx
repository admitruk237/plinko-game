'use client';

import { BottomNav, Header } from '@/widgets';
import { ErrorState, LoadingState } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { useProfileClient } from './model/useProfileClient';
import { ProfileCard } from './ui/ProfileCard';
import { ProfileStatCard } from './ui/ProfileStatCard';
import { motion } from 'motion/react';
import { usePageTransition } from '@/shared/lib/page-transition-context';

const LOADING_MESSAGE = 'Loading profile...';
const ERROR_MESSAGE = 'Failed to load profile';

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

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
  const { isTransitioning } = usePageTransition();

  if (isLoading) return <LoadingState message={LOADING_MESSAGE} />;
  if (isError || !profile) return <ErrorState message={ERROR_MESSAGE} />;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <Header
        title="Profile"
        showBackButton
        backRoute={ROUTES.GAME}
        variant="subpage"
        maxWidthClassName="max-w-[896px] px-4"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[896px] flex-col gap-4 p-4">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isTransitioning ? 'hidden' : 'visible'}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <ProfileCard
              profile={profile}
              balanceDisplay={balanceDisplay}
              levelPercent={levelPercent}
              nickname={nickname}
              avatar={avatar}
            />
          </motion.div>

          <motion.div
            className="flex gap-4"
            variants={itemVariants}
            initial="hidden"
            animate={isTransitioning ? 'hidden' : 'visible'}
            transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          >
            <ProfileStatCard label="Total XP" value={totalXp} />
            <ProfileStatCard label="Member Since" value={memberSince} />
          </motion.div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
