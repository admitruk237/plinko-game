'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { BottomNav, GameSidebar, Header, PlinkoBoard } from '@/widgets';

import { Button, LoadingState, LogoutIcon } from '@/shared/ui';
import { CompactBetController } from './ui/CompactBetController';
import { useGameClient } from './model/useGameClient';

const LOADING_MESSAGE = 'Loading game...';
const LOGOUT_ICON_SIZE = 14;
const MENU_ICON_SIZE = 20;

export const GameClient = () => {
  const {
    config,
    balance,
    handlePlaceBet,
    currentAnimations,
    handleAnimationEnd,
    playPegHit,
    logoutRef,
    onLogoutMouseEnter,
    onLogoutMouseLeave,
    handleLogout,
  } = useGameClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <div
        className={cn(
          'md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={handleCloseSettings}
      />
      <div className="flex-1 flex min-h-0 overflow-hidden md:flex-row flex-col relative">
        <div
          className={cn(
            'md:relative md:translate-y-0 md:h-full md:w-[320px] md:min-w-[320px] md:border-r md:border-panel-border md:bg-panel md:z-10 shrink-0',
            'max-md:absolute max-md:top-0 max-md:bottom-0 max-md:left-0 max-md:h-full max-md:w-[80vw] max-md:max-w-[80%] max-md:z-50 max-md:bg-panel max-md:border-r max-md:border-panel-border max-md:p-4 max-md:flex max-md:flex-col max-md:transition-transform max-md:duration-300 max-md:ease-out max-md:overflow-y-auto max-md:[scrollbar-width:thin] max-md:[scrollbar-color:var(--color-panel-border)_transparent] max-md:[&::-webkit-scrollbar]:w-1 max-md:[&::-webkit-scrollbar-track]:bg-transparent max-md:[&::-webkit-scrollbar-thumb]:bg-panel-border max-md:[&::-webkit-scrollbar-thumb]:rounded-full',
            !isSidebarOpen && 'max-md:-translate-x-full'
          )}
        >
          <GameSidebar
            config={config}
            balance={balance}
            onPlaceBet={handlePlaceBet}
            showCloseButton
            onClose={handleCloseSettings}
          />
        </div>

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
              currentAnimations={currentAnimations}
              onAnimationEnd={handleAnimationEnd}
              onPegHit={playPegHit}
            />

            <CompactBetController onOpenSettings={handleOpenSettings} />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
