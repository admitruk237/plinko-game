'use client';

import { BottomNav, GameSidebar, Header, PlinkoBoard } from '@/widgets';
import { Button, LoadingState, LogoutIcon } from '@/shared/ui';
import { useGameClient } from './model/useGameClient';

const LOADING_MESSAGE = 'Loading game...';

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

  if (!config) {
    return <LoadingState message={LOADING_MESSAGE} />;
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <div className="flex-1 flex min-h-0 overflow-hidden md:flex-row flex-col">
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

        <div className="order-1 md:order-2 flex-1 flex flex-col overflow-hidden relative min-h-0">
          <Header
            title="Plinko"
            showBalance
            balance={balance}
            rightAction={
              <Button
                onClick={handleLogout}
                variant="headerAction"
                size="none"
                onMouseEnter={onLogoutMouseEnter}
                onMouseLeave={onLogoutMouseLeave}
              >
                <LogoutIcon ref={logoutRef} size={14} />
                <span className="max-sm:hidden">Logout</span>
              </Button>
            }
          />

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
      <BottomNav />
    </div>
  );
};
