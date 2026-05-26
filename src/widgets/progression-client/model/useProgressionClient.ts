import { useState } from 'react';
import { useProgression, useClaimDaily, useClaimMission } from '@/features/progression';
import { levelProgress } from '@/shared/lib/progression';
import type { MissionDto, ProgressionAggregateDto } from '@/shared/api/types';

interface ProgressionView {
  progression: ProgressionAggregateDto | undefined;
  isLoading: boolean;
  isError: boolean;
  levelPercent: number;
  onClaimDaily: () => void;
  isClaimingDaily: boolean;
  onClaimMission: (id: string) => void;
  claimingMissionId: string | null;
  dailyMissions: MissionDto[];
  starterMissions: MissionDto[];
}

export const useProgressionClient = (): ProgressionView => {
  const { data: progression, isLoading, isError } = useProgression();
  const claimDaily = useClaimDaily();
  const claimMission = useClaimMission();
  const [claimingMissionId, setClaimingMissionId] = useState<string | null>(null);

  const levelPercent = progression
    ? levelProgress(progression).percent
    : 0;

  const onClaimDaily = () => {
    claimDaily.mutate();
  };

  const onClaimMission = (id: string) => {
    setClaimingMissionId(id);
    claimMission.mutate(id, {
      onSettled: () => setClaimingMissionId(null),
    });
  };

  return {
    progression,
    isLoading,
    isError,
    levelPercent,
    onClaimDaily,
    isClaimingDaily: claimDaily.isPending,
    onClaimMission,
    claimingMissionId,
    dailyMissions: progression?.missions.daily ?? [],
    starterMissions: progression?.missions.starter ?? [],
  };
};
