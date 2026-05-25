'use client';

import { type ReactNode, useRef } from 'react';
import Link from 'next/link';
import { formatCredits } from '@/shared/lib/credits';
import { useSound } from '@/features/game';
import { Button, CurrencyIcon, MoveLeftIcon, type MoveLeftIconHandle } from '@/shared/ui';

interface Props {
  title: string;
  balance?: string;
  showBalance?: boolean;
  showBackButton?: boolean;
  backRoute?: string;
  rightAction?: ReactNode;
}

export const Header = ({
  title,
  balance,
  showBalance = false,
  showBackButton = false,
  backRoute,
  rightAction,
}: Props) => {
  const backIconRef = useRef<MoveLeftIconHandle>(null);
  const { playClick } = useSound();

  return (
    <header className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-white/5 w-full shrink-0">
      <div className="flex items-center gap-2 sm:gap-[19px] min-w-0">
        {showBackButton && backRoute && (
          <Button
            render={<Link href={backRoute} />}
            nativeButton={false}
            variant="headerAction"
            size="none"
            onClick={playClick}
            onMouseEnter={() => backIconRef.current?.startAnimation()}
            onMouseLeave={() => backIconRef.current?.stopAnimation()}
            className="h-[46px] px-3 sm:px-4 gap-1.5 rounded-[10px]"
          >
            <MoveLeftIcon ref={backIconRef} size={16} />
            <span className="max-sm:hidden">Back to Game</span>
          </Button>
        )}
        <h1 className="text-xl sm:text-2xl font-bold text-white leading-8 tracking-[0.07px] shrink-0">
          {title}
        </h1>
        {showBalance && balance !== undefined && (
          <div className="flex items-center gap-2 bg-balance-bg border border-balance-border rounded-[10px] py-2 px-3 sm:px-4 min-w-0 h-[46px] opacity-100">
            <CurrencyIcon />
            <span className="max-sm:hidden font-sans font-normal text-xs text-balance-label leading-4 tracking-normal shrink-0">
              Balance:
            </span>
            <span className="font-sans font-bold text-base sm:text-lg text-balance-value leading-7 tracking-[-0.44px] truncate">
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
