'use client';

import { useEffect, useState } from 'react';
import { GameHeader, GameSidebar, PlinkoBoard } from '@/widgets';
import { type Risk, useGameStore } from '@/entities/game';
import { useSessionStore } from '@/entities/session';
import { useCurrentUser, useGameConfig, useGamePlay, useLogout, useSound } from '@/features/game';
import { useSettingsStore } from '@/entities/settings';
import { RISK_LEVELS } from '@/shared/config';

export const GameClient = () => {
  const user = useSessionStore((s) => s.user);

  const isPlaying = useGameStore((s) => s.isPlaying);
  const setPlaying = useGameStore((s) => s.setPlaying);

  const [rows, setRows] = useState<number>(12);
  const [risk, setRisk] = useState<Risk>(RISK_LEVELS.HIGH);

  const { data: config } = useGameConfig();
  const { data: freshUser } = useCurrentUser();
  const logoutMutation = useLogout();

  const { currentAnimations, handlePlaceBet, handleAnimationEnd } = useGamePlay({ setPlaying });
  const { playPegHit, playClick } = useSound();
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled);

  useEffect(() => {
    const onButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('[role="button"]')) {
        playClick();
      }
    };
    document.addEventListener('click', onButtonClick);
    return () => document.removeEventListener('click', onButtonClick);
  }, [playClick]);

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

  const payoutTable = config.payoutTables[risk]?.[rows.toString()] ?? [];

  return (
    <div className="flex h-[100dvh] overflow-hidden md:flex-row flex-col">
      {/* Sidebar: bottom on mobile, left on desktop */}
      <div className="order-2 md:order-1 md:h-full max-md:h-[45dvh] max-md:overflow-y-auto shrink-0">
        <GameSidebar
          config={config}
          balance={balance}
          isPlaying={isPlaying}
          rows={rows}
          risk={risk}
          onRowsChange={setRows}
          onRiskChange={setRisk}
          onPlaceBet={handlePlaceBet}
        />
      </div>

      {/* Board area: top on mobile, right on desktop */}
      <div className="order-1 md:order-2 flex-1 flex flex-col overflow-hidden relative min-h-0">
        <GameHeader balance={balance} onLogout={() => logoutMutation.mutate()} />

        <div className="relative flex-1 flex flex-col min-h-0">
          <PlinkoBoard
            rows={rows}
            risk={risk}
            payoutTable={payoutTable}
            currentAnimations={currentAnimations}
            onAnimationEnd={handleAnimationEnd}
            onPegHit={playPegHit}
            animationsEnabled={animationsEnabled}
          />
        </div>
      </div>
    </div>
  );
};
