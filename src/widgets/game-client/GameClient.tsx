'use client';

import { GameHeader } from '@/widgets/game-header/GameHeader';
import { GameSidebar } from '@/widgets/game-sidebar/GameSidebar';
import { PlinkoBoard } from '@/widgets/game-board/PlinkoBoard';
import { RecentResults } from '@/widgets/recent-results/RecentResults';
import { useGameStore } from '@/entities/game/model/store';
import { useSessionStore } from '@/entities/session/model/store';
import { useGameConfig, useCurrentUser, useLogout, useGamePlay } from '@/features/game';

export const GameClient = () => {
  const user = useSessionStore((s) => s.user);

  const recentResults = useGameStore((s) => s.recentResults);
  const isPlaying = useGameStore((s) => s.isPlaying);
  const setPlaying = useGameStore((s) => s.setPlaying);

  const { data: config } = useGameConfig();
  const { data: freshUser } = useCurrentUser();
  const logoutMutation = useLogout();

  const {
    currentAnimation,
    selectedRows,
    selectedRisk,
    handlePlaceBet,
    handleAnimationEnd,
  } = useGamePlay({ isPlaying, setPlaying });

  const balance = freshUser?.balance ?? user?.balance ?? '0';

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 text-white/50">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading game...
        </div>
      </div>
    );
  }

  const payoutTable = config.payoutTables[selectedRisk]?.[selectedRows.toString()] ?? [];

  return (
    <div className="flex h-screen overflow-hidden max-md:flex-col">
      <GameSidebar
        config={config}
        balance={balance}
        isPlaying={isPlaying}
        onPlaceBet={handlePlaceBet}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <GameHeader balance={balance} onLogout={() => logoutMutation.mutate()} />

        <div className="relative flex-1 flex flex-col">
          <RecentResults results={recentResults} />

          <PlinkoBoard
            rows={selectedRows}
            risk={selectedRisk}
            payoutTable={payoutTable}
            currentAnimation={currentAnimation}
            onAnimationEnd={handleAnimationEnd}
          />
        </div>
      </div>
    </div>
  );
};
