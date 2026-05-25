'use client';

import { type ReactNode, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  ClockIcon,
  type ClockIconHandle,
  GameIcon,
  type GameIconHandle,
  ProfileIcon,
  type ProfileIconHandle,
  TrophyIcon,
  type TrophyIconHandle,
} from '@/shared/ui';
import { cn } from '@/shared/lib/utils';
import { useSound } from '@/features/game';
import { ICON_SIZE_DEFAULT, ICON_SIZE_GAME, NAV_ITEMS_CONFIG } from './constants';

export interface NavItem {
  route: string;
  label: string;
  isActive: boolean;
  icon: ReactNode;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

export const useBottomNav = () => {
  const pathname = usePathname();
  const { playClick } = useSound();

  const gameIconRef = useRef<GameIconHandle>(null);
  const progressIconRef = useRef<TrophyIconHandle>(null);
  const historyIconRef = useRef<ClockIconHandle>(null);
  const profileIconRef = useRef<ProfileIconHandle>(null);

  const getIcon = (
    type: 'game' | 'progress' | 'history' | 'profile',
    active: boolean
  ): ReactNode => {
    switch (type) {
      case 'game':
        return (
          <GameIcon
            ref={gameIconRef}
            size={ICON_SIZE_GAME}
            className={cn(active ? 'text-[#00C950]' : 'text-[#99A1AF]')}
          />
        );
      case 'progress':
        return (
          <TrophyIcon
            ref={progressIconRef}
            size={ICON_SIZE_DEFAULT}
            className={cn(active ? 'text-[#00C950]' : 'text-[#99A1AF]')}
          />
        );
      case 'history':
        return (
          <ClockIcon
            ref={historyIconRef}
            size={ICON_SIZE_DEFAULT}
            className={cn(active ? 'text-[#00C950]' : 'text-[#99A1AF]')}
          />
        );
      case 'profile':
        return (
          <ProfileIcon
            ref={profileIconRef}
            size={ICON_SIZE_DEFAULT}
            className={cn(active ? 'text-[#00C950]' : 'text-[#99A1AF]')}
          />
        );
      default:
        return null;
    }
  };

  const getHoverCallbacks = (type: 'game' | 'progress' | 'history' | 'profile') => {
    switch (type) {
      case 'game':
        return {
          onHoverStart: () => gameIconRef.current?.startAnimation(),
          onHoverEnd: () => gameIconRef.current?.stopAnimation(),
        };
      case 'progress':
        return {
          onHoverStart: () => progressIconRef.current?.startAnimation(),
          onHoverEnd: () => progressIconRef.current?.stopAnimation(),
        };
      case 'history':
        return {
          onHoverStart: () => historyIconRef.current?.startAnimation(),
          onHoverEnd: () => historyIconRef.current?.stopAnimation(),
        };
      case 'profile':
        return {
          onHoverStart: () => profileIconRef.current?.startAnimation(),
          onHoverEnd: () => profileIconRef.current?.stopAnimation(),
        };
      default:
        return {
          onHoverStart: () => {},
          onHoverEnd: () => {},
        };
    }
  };

  const navItems: NavItem[] = NAV_ITEMS_CONFIG.map((item) => {
    const isActive = pathname === item.route;
    const { onHoverStart, onHoverEnd } = getHoverCallbacks(item.iconType);
    const icon = getIcon(item.iconType, isActive);

    return {
      route: item.route,
      label: item.label,
      isActive,
      icon,
      onHoverStart,
      onHoverEnd,
      onClick: () => {
        playClick();
      },
    };
  });

  return {
    navItems,
  };
};
