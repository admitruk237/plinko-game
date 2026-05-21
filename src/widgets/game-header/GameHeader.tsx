'use client';

import Link from 'next/link';
import { formatCredits } from '@/shared/lib/credits';
import { CurrencyIcon } from '@/shared/ui/currency-icon';
import { ROUTES } from '@/shared/config';

interface Props {
  balance: string;
  onLogout: () => void;
}

export const GameHeader = ({ balance, onLogout }: Props) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-white/5">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white tracking-tight">Plinko</h1>
        <div className="flex items-center gap-1.5 bg-[#1a2c1a] border border-green-500/20 rounded-full px-3 py-1.5">
          <CurrencyIcon />
          <span className="text-sm font-semibold text-green-400">
            Balance: {formatCredits(balance)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.HISTORY}
          className="flex items-center gap-1.5 bg-[#1e2231] hover:bg-[#252a3a] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/80 font-medium transition-colors"
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
          History
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 bg-[#1e2231] hover:bg-[#252a3a] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/80 font-medium transition-colors"
        >
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
          Logout
        </button>
      </div>
    </header>
  );
};
