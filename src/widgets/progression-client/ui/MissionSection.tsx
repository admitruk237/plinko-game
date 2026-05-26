import type { MissionDto } from '@/shared/api/types';
import { MissionCard } from './MissionCard';

interface Props {
  title: string;
  missions: MissionDto[];
  claimingId: string | null;
  onClaim: (id: string) => void;
}

export const MissionSection = ({ title, missions, claimingId, onClaim }: Props) => {
  if (missions.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-[#99A1AF] uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            isClaiming={claimingId === mission.id}
            onClaim={onClaim}
          />
        ))}
      </div>
    </div>
  );
};
