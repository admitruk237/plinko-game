'use client';

import { useEffect, useRef, useState } from 'react';
import { type Risk, useGameStore } from '@/entities/game';
import { useSessionStore } from '@/entities/session';
import { useCurrentUser, useGameConfig, useGamePlay, useLogout, useSound } from '@/features/game';
import { useSettingsStore } from '@/entities/settings';
import { RISK_LEVELS } from '@/shared/config';
import type { LogoutIconHandle } from '@/shared/ui';

export const useGameClient = () => {
  const user = useSessionStore((s) => s.user);
  const logoutRef = useRef<LogoutIconHandle>(null);

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
  const payoutTable = config?.payoutTables[risk]?.[rows.toString()] ?? [];

  const onLogoutMouseEnter = () => logoutRef.current?.startAnimation();
  const onLogoutMouseLeave = () => logoutRef.current?.stopAnimation();
  const handleLogout = () => logoutMutation.mutate();

  return {
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
  };
};
