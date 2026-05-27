'use client';

import { type ReactNode, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { formatCredits } from '@/shared/lib/credits';
import { useLogout, useSound } from '@/features/game';
import {
  ArrowLeftIcon,
  type ArrowLeftIconHandle,
  Button,
  CurrencyIcon,
  LogoutIcon,
  type LogoutIconHandle,
  MoveLeftIcon,
  type MoveLeftIconHandle,
} from '@/shared/ui';

interface Props {
  title: string;
  balance?: string;
  showBalance?: boolean;
  showBackButton?: boolean;
  backRoute?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  variant?: 'game' | 'subpage';
  maxWidthClassName?: string;
}

const MOVE_LEFT_ICON_SIZE = 16;
const ARROW_LEFT_ICON_SIZE = 28;
const LOGOUT_ICON_SIZE = 14;

export const Header = ({
  title,
  balance,
  showBalance = false,
  showBackButton = false,
  backRoute,
  leftAction,
  rightAction,
  variant = 'game',
  maxWidthClassName = 'max-w-[896px]',
}: Props) => {
  const backIconRef = useRef<MoveLeftIconHandle>(null);
  const backArrowRef = useRef<ArrowLeftIconHandle>(null);
  const logoutIconRef = useRef<LogoutIconHandle>(null);

  const { playClick } = useSound();
  const logoutMutation = useLogout();

  const handleLogoutClick = () => {
    logoutMutation.mutate();
  };

  if (variant === 'subpage') {
    return (
      <header className="w-full shrink-0 border-b border-white/5 py-2 sm:py-3">
        <div className={cn('mx-auto flex w-full items-center justify-between', maxWidthClassName)}>
          <div className="flex items-center gap-4 min-w-0">
            {leftAction}
            {showBackButton && backRoute && (
              <Button
                render={<Link href={backRoute} />}
                nativeButton={false}
                variant="icon"
                size="none"
                onClick={playClick}
                onMouseEnter={() => backArrowRef.current?.startAnimation()}
                onMouseLeave={() => backArrowRef.current?.stopAnimation()}
                className="flex items-center justify-center text-white/60 transition-colors hover:text-white shrink-0"
              >
                <ArrowLeftIcon ref={backArrowRef} size={ARROW_LEFT_ICON_SIZE} />
              </Button>
            )}
            <h1 className="text-xl sm:text-2xl font-bold leading-8 tracking-[0.07px] text-white shrink-0">
              {title}
            </h1>
            <Button
              onClick={handleLogoutClick}
              variant="headerAction"
              size="none"
              onMouseEnter={() => logoutIconRef.current?.startAnimation()}
              onMouseLeave={() => logoutIconRef.current?.stopAnimation()}
              className="flex h-[46px] gap-1.5 rounded-[10px] px-3 sm:px-4 shrink-0"
            >
              <LogoutIcon ref={logoutIconRef} size={LOGOUT_ICON_SIZE} />
              <span className="max-sm:hidden">Logout</span>
            </Button>
          </div>
          {rightAction && (
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">{rightAction}</div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="flex w-full shrink-0 items-center justify-between border-b border-white/5 px-3 py-2 sm:px-4 sm:py-3">
      <div className="flex items-center gap-2 sm:gap-[19px] min-w-0">
        {leftAction}
        {showBackButton && backRoute && (
          <Button
            render={<Link href={backRoute} />}
            nativeButton={false}
            variant="headerAction"
            size="none"
            onClick={playClick}
            onMouseEnter={() => backIconRef.current?.startAnimation()}
            onMouseLeave={() => backIconRef.current?.stopAnimation()}
            className="flex h-[46px] gap-1.5 rounded-[10px] px-3 sm:px-4 shrink-0"
          >
            <MoveLeftIcon ref={backIconRef} size={MOVE_LEFT_ICON_SIZE} />
            <span className="max-sm:hidden">Back to Game</span>
          </Button>
        )}
        <h1 className="text-xl sm:text-2xl font-bold leading-8 tracking-[0.07px] text-white shrink-0">
          {title}
        </h1>
        {showBalance && balance !== undefined && (
          <div className="bg-balance-bg border border-balance-border flex h-[38px] sm:h-[46px] items-center gap-1.5 sm:gap-2 rounded-[10px] px-2.5 py-1 sm:px-4 opacity-100 min-w-0">
            <CurrencyIcon />
            <span className="text-balance-label font-sans text-xs font-normal leading-4 tracking-normal max-sm:hidden shrink-0">
              Balance:
            </span>
            <span className="text-balance-value font-sans text-sm sm:text-base font-bold leading-7 tracking-[-0.44px] truncate">
              {formatCredits(balance)}
            </span>
          </div>
        )}
      </div>
      {rightAction && (
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">{rightAction}</div>
      )}
    </header>
  );
};
