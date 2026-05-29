'use client';

import { BottomNav, Header } from '@/widgets';
import { ErrorState, LoadingState } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { useProgressionClient } from './model/useProgressionClient';
import { LevelProgressCard } from './ui/LevelProgressCard';
import { DailyRewardCard } from './ui/DailyRewardCard';
import { MissionSection } from './ui/MissionSection';
import { motion } from 'motion/react';
import { usePageTransition } from '@/shared/lib/page-transition-context';

const LOADING_MESSAGE = 'Loading progression...';
const ERROR_MESSAGE = 'Failed to load progression';

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export const ProgressionClient = () => {
  const {
    progression,
    isLoading,
    isError,
    levelPercent,
    onClaimDaily,
    isClaimingDaily,
    onClaimMission,
    claimingMissionId,
    dailyMissions,
    starterMissions,
  } = useProgressionClient();
  const { isTransitioning } = usePageTransition();

  if (isLoading) return <LoadingState message={LOADING_MESSAGE} />;
  if (isError || !progression) return <ErrorState message={ERROR_MESSAGE} />;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <Header
        title="Progression"
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
            <LevelProgressCard
              level={progression.level}
              xpIntoCurrentLevel={progression.xpIntoCurrentLevel}
              xpForNextLevel={progression.xpForNextLevel}
              levelPercent={levelPercent}
              totalXp={progression.xp}
              dailyStreak={progression.daily.streak}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isTransitioning ? 'hidden' : 'visible'}
            transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          >
            <DailyRewardCard
              credits={progression.daily.reward.credits}
              xp={progression.daily.reward.xp}
              streak={progression.daily.streak}
              canClaim={progression.daily.canClaim}
              nextClaimAt={progression.daily.nextClaimAt}
              isClaiming={isClaimingDaily}
              onClaim={onClaimDaily}
            />
          </motion.div>

          {(dailyMissions.length > 0 || starterMissions.length > 0) && (
            <div className="flex flex-col gap-6">
              {dailyMissions.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate={isTransitioning ? 'hidden' : 'visible'}
                  transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
                >
                  <MissionSection
                    title="Daily Missions"
                    missions={dailyMissions}
                    claimingId={claimingMissionId}
                    onClaim={onClaimMission}
                  />
                </motion.div>
              )}
              {starterMissions.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate={isTransitioning ? 'hidden' : 'visible'}
                  transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
                >
                  <MissionSection
                    title="Starter Missions"
                    missions={starterMissions}
                    claimingId={claimingMissionId}
                    onClaim={onClaimMission}
                  />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
