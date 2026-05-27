'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { BottomNav, GameSidebar, Header, PlinkoBoard } from '@/widgets';
import type { CompactState } from '@/widgets/game-sidebar/GameSidebar';
import { Button, LoadingState, LogoutIcon } from '@/shared/ui';
import { BET_MODES } from '@/shared/config';
import { CompactBetController } from './ui/CompactBetController';
import { useGameClient } from './model/useGameClient';

const LOADING_MESSAGE = 'Loading game...';
const INITIAL_BET_AMOUNT = '1.00';
const INITIAL_BET_MODE = BET_MODES.MANUAL;
const INITIAL_BET_COUNT = 0;
const INITIAL_LIMIT_BETS = 0;
const LOGOUT_ICON_SIZE = 14;
const MENU_ICON_SIZE = 20;

export const GameClient = () => {
  const {
    config,
    balance,
    isPlaying,
    rows,
    risk,
    setRows,
    setRisk,
    handlePlaceBet,
    currentAnimations,
    handleAnimationEnd,
    playPegHit,
    animationsEnabled,
    payoutTable,
    logoutRef,
    onLogoutMouseEnter,
    onLogoutMouseLeave,
    handleLogout,
  } = useGameClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [compactState, setCompactState] = useState<CompactState>({
    betAmount: INITIAL_BET_AMOUNT,
    mode: INITIAL_BET_MODE,
    isAutoBetting: false,
    limitNumBets: INITIAL_LIMIT_BETS,
    currentBetCount: INITIAL_BET_COUNT,
    isBetButtonDisabled: false,
  });

  if (!config) {
    return <LoadingState message={LOADING_MESSAGE} />;
  }

  const handleOpenSettings = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      {/* Backdrop for Mobile Sidebar Drawer */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={handleCloseSettings}
      />

      <div className="flex-1 flex min-h-0 overflow-hidden md:flex-row flex-col relative">
        {/* Sidebar Container */}
        <div
          className={cn(
            // Desktop layout: normal left column
            'md:relative md:translate-y-0 md:h-full md:w-[320px] md:min-w-[320px] md:border-r md:border-[#2A2F3E] md:bg-[#1A1F2E] md:z-10 shrink-0',
            // Mobile layout: left fixed slide-out drawer overlay taking 80% width with scroll support
            'max-md:absolute max-md:top-0 max-md:bottom-0 max-md:left-0 max-md:h-full max-md:w-[80vw] max-md:max-w-[80%] max-md:z-50 max-md:bg-[#1A1F2E] max-md:border-r max-md:border-[#2A2F3E] max-md:p-4 max-md:flex max-md:flex-col max-md:transition-transform max-md:duration-300 max-md:ease-out max-md:overflow-y-auto max-md:[scrollbar-width:thin] max-md:[scrollbar-color:#2A2F3E_transparent] max-md:[&::-webkit-scrollbar]:w-1 max-md:[&::-webkit-scrollbar-track]:bg-transparent max-md:[&::-webkit-scrollbar-thumb]:bg-[#2A2F3E] max-md:[&::-webkit-scrollbar-thumb]:rounded-full',
            !isSidebarOpen && 'max-md:-translate-x-full'
          )}
        >
          <GameSidebar
            config={config}
            balance={balance}
            isPlaying={isPlaying}
            rows={rows}
            risk={risk}
            onRowsChange={setRows}
            onRiskChange={setRisk}
            onPlaceBet={handlePlaceBet}
            onCompactStateChange={setCompactState}
            showCloseButton
            onClose={handleCloseSettings}
          />
        </div>

        {/* Board and Header Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
          <Header
            title="Plinko"
            showBalance
            balance={balance}
            leftAction={
              <Button
                onClick={handleOpenSettings}
                variant="icon"
                size="none"
                className="md:hidden p-1.5 text-white/60 hover:text-white transition-colors flex items-center justify-center shrink-0 mr-2"
              >
                <Menu size={MENU_ICON_SIZE} />
              </Button>
            }
            rightAction={
              <Button
                onClick={handleLogout}
                variant="headerAction"
                size="none"
                onMouseEnter={onLogoutMouseEnter}
                onMouseLeave={onLogoutMouseLeave}
              >
                <LogoutIcon ref={logoutRef} size={LOGOUT_ICON_SIZE} />
                <span className="max-sm:hidden">Logout</span>
              </Button>
            }
          />

          <div className="relative flex-1 flex flex-col min-h-0 bg-transparent">
            <PlinkoBoard
              rows={rows}
              risk={risk}
              payoutTable={payoutTable}
              currentAnimations={currentAnimations}
              onAnimationEnd={handleAnimationEnd}
              onPegHit={playPegHit}
              animationsEnabled={animationsEnabled}
            />

            {/* Compact Floating Controller for Mobile */}
            <CompactBetController
              betAmount={compactState.betAmount}
              risk={risk}
              rows={rows}
              isAutoBetting={compactState.isAutoBetting}
              limitNumBets={compactState.limitNumBets}
              currentBetCount={compactState.currentBetCount}
              disabled={compactState.isBetButtonDisabled}
              mode={compactState.mode}
              onOpenSettings={handleOpenSettings}
            />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
