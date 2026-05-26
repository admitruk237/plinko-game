'use client';

import { BottomNav, Header } from '@/widgets';
import { ErrorState, LoadingState } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { useProgressionClient } from './model/useProgressionClient';
import { LevelProgressCard } from './ui/LevelProgressCard';
import { DailyRewardCard } from './ui/DailyRewardCard';
import { MissionSection } from './ui/MissionSection';

const LOADING_MESSAGE = 'Loading progression...';
const ERROR_MESSAGE = 'Failed to load progression';

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

  if (isLoading) return <LoadingState message={LOADING_MESSAGE} />;
  if (isError || !progression) return <ErrorState message={ERROR_MESSAGE} />;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <Header title="Progress" showBackButton backRoute={ROUTES.GAME} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[896px] flex-col gap-4 p-4">
          <LevelProgressCard
            level={progression.level}
            xpIntoCurrentLevel={progression.xpIntoCurrentLevel}
            xpForNextLevel={progression.xpForNextLevel}
            levelPercent={levelPercent}
            totalXp={progression.xp}
            dailyStreak={progression.daily.streak}
          />

          <DailyRewardCard
            credits={progression.daily.reward.credits}
            xp={progression.daily.reward.xp}
            streak={progression.daily.streak}
            canClaim={progression.daily.canClaim}
            nextClaimAt={progression.daily.nextClaimAt}
            isClaiming={isClaimingDaily}
            onClaim={onClaimDaily}
          />

          {(dailyMissions.length > 0 || starterMissions.length > 0) && (
            <div className="flex flex-col gap-6">
              <MissionSection
                title="Daily Missions"
                missions={dailyMissions}
                claimingId={claimingMissionId}
                onClaim={onClaimMission}
              />
              <MissionSection
                title="Starter Missions"
                missions={starterMissions}
                claimingId={claimingMissionId}
                onClaim={onClaimMission}
              />
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
