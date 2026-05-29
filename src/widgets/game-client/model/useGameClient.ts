'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/entities/game';
import { useSessionStore } from '@/entities/session';
import { useCurrentUser, useGameConfig, useGamePlay, useLogout, useSound } from '@/features/game';
import type { LogoutIconHandle } from '@/shared/ui';

export const useGameClient = () => {
  const user = useSessionStore((s) => s.user);
  const logoutRef = useRef<LogoutIconHandle>(null);

  const setPlaying = useGameStore((s) => s.setPlaying);

  const { data: config } = useGameConfig();
  const { data: freshUser } = useCurrentUser();
  const logoutMutation = useLogout();

  const { currentAnimations, handlePlaceBet, handleAnimationEnd } = useGamePlay({ setPlaying });
  const { playPegHit, playClick } = useSound();

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

  const onLogoutMouseEnter = () => logoutRef.current?.startAnimation();
  const onLogoutMouseLeave = () => logoutRef.current?.stopAnimation();
  const handleLogout = () => logoutMutation.mutate();

  return {
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
  };
};
