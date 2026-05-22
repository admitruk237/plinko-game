'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { formatCredits } from '@/shared/lib/credits';
import {
  Button,
  ClockIcon,
  type ClockIconHandle,
  CurrencyIcon,
  LogoutIcon,
  type LogoutIconHandle,
} from '@/shared/ui';
import { ROUTES } from '@/shared/config';

interface Props {
  balance: string;
  onLogout: () => void;
}

const ICON_SIZE = 14;

export const GameHeader = ({ balance, onLogout }: Props) => {
  const clockRef = useRef<ClockIconHandle>(null);
  const logoutRef = useRef<LogoutIconHandle>(null);

  return (
    <header className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-white/5">
      <div className="flex items-center gap-2 sm:gap-[19px] min-w-0">
        <h1 className="text-2xl font-bold text-white leading-8 tracking-[0.07px] shrink-0">
          Plinko
        </h1>
        <div className="flex items-center gap-2 bg-balance-bg border border-balance-border rounded-[10px] py-2 px-3 sm:px-4 min-w-0 h-[46px] opacity-100">
          <CurrencyIcon />
          <span className="max-sm:hidden font-sans font-normal text-xs text-balance-label leading-4 tracking-normal shrink-0">
            Balance:
          </span>
          <span className="font-sans font-bold text-base sm:text-lg text-balance-value leading-7 tracking-[-0.44px] truncate">
            {formatCredits(balance)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <Button
          render={<Link href={ROUTES.HISTORY} />}
          nativeButton={false}
          variant="headerAction"
          size="none"
          onMouseEnter={() => clockRef.current?.startAnimation()}
          onMouseLeave={() => clockRef.current?.stopAnimation()}
        >
          <ClockIcon ref={clockRef} size={ICON_SIZE} />
          <span className="max-sm:hidden">History</span>
        </Button>
        <Button
          onClick={onLogout}
          variant="headerAction"
          size="none"
          onMouseEnter={() => logoutRef.current?.startAnimation()}
          onMouseLeave={() => logoutRef.current?.stopAnimation()}
        >
          <LogoutIcon ref={logoutRef} size={ICON_SIZE} />
          <span className="max-sm:hidden">Logout</span>
        </Button>
      </div>
    </header>
  );
};
