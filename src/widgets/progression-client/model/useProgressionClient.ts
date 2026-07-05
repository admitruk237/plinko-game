import { useState } from 'react';
import { toast } from 'sonner';
import { useClaimDaily, useClaimMission, useProgression } from '@/features/progression';
import { levelProgress } from '@/shared/lib/progression';
import { formatCredits } from '@/shared/lib/credits';
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

  const levelPercent = progression ? levelProgress(progression).percent : 0;

  const onClaimDaily = () => {
    claimDaily.mutate(undefined, {
      onSuccess: (result) => {
        const credits = formatCredits(result.reward.credits);
        toast.success(`Daily reward claimed! +${credits} credits, +${result.reward.xp} XP`);
      },
    });
  };

  const onClaimMission = (id: string) => {
    const mission = [
      ...(progression?.missions.daily ?? []),
      ...(progression?.missions.starter ?? []),
    ].find((m) => m.id === id);

    setClaimingMissionId(id);
    claimMission.mutate(id, {
      onSuccess: (result) => {
        const credits = formatCredits(result.reward.credits);
        const label = mission?.title ?? 'Mission';
        toast.success(`${label} claimed! +${credits} credits, +${result.reward.xp} XP`);
      },
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
