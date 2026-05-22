'use client';

import Link from 'next/link';
import { formatCredits } from '@/shared/lib/credits';
import { Button, CurrencyIcon } from '@/shared/ui';
import { ROUTES } from '@/shared/config';

interface Props {
  balance: string;
  onLogout: () => void;
}

export const GameHeader = ({ balance, onLogout }: Props) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-white/5">
      <div className="flex items-center gap-[19px]">
        <h1 className="text-2xl font-bold text-white leading-8 tracking-[0.07px]">Plinko</h1>
        <div className="flex items-center gap-2 bg-balance-bg border border-balance-border rounded-[10px] py-2 px-4 w-[206.23px] h-[46px] opacity-100">
          <CurrencyIcon />
          <span className="font-sans font-normal text-xs text-balance-label leading-4 tracking-normal">
            Balance:
          </span>
          <span className="font-sans font-bold text-lg text-balance-value leading-7 tracking-[-0.44px]">
            {formatCredits(balance)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          render={<Link href={ROUTES.HISTORY} />}
          nativeButton={false}
          variant="headerAction"
          size="none"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          <span className="max-sm:hidden">History</span>
        </Button>
        <Button onClick={onLogout} variant="headerAction" size="none">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="max-sm:hidden">Logout</span>
        </Button>
      </div>
    </header>
  );
};
