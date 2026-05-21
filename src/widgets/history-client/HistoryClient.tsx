'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import type { BetResponse } from '@/entities/game/model/types';
import { Label } from '@/shared/ui/label';
import { useBetHistory } from '@/features/bet-history';
import { BetTable } from './BetTable';
import { BetDetailDrawer } from './BetDetailDrawer';

import { ROUTES } from '@/shared/config';

export const HistoryClient = () => {
  const [filterRows, setFilterRows] = useState<string>('all');
  const [selectedBet, setSelectedBet] = useState<BetResponse | null>(null);

  const rowsParam = filterRows !== 'all' ? Number(filterRows) : undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useBetHistory(rowsParam);

  const allBets = data?.pages.flatMap((p) => p.items) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderBets = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-5 w-5 text-white/50" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      );
    }
    if (allBets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <p className="mt-3 text-sm">No bets yet</p>
        </div>
      );
    }
    return <BetTable bets={allBets} onSelectBet={setSelectedBet} />;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.GAME}
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15,18 9,12 15,6" />
            </svg>
            Back
          </Link>
          <h1 className="text-xl font-bold text-white">Bet History</h1>
        </div>
      </header>

      <div className="flex items-center gap-4 px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-white/50">Rows:</Label>
          <select
            value={filterRows}
            onChange={(e) => setFilterRows(e.target.value)}
            className="bg-[#1a1e2e] border border-white/10 rounded-lg px-2 py-1 text-sm text-white outline-none"
          >
            <option value="all">All</option>
            {Array.from({ length: 9 }, (_, i) => i + 8).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6">
        {renderBets()}

        {/* Load More */}
        {hasNextPage && (
          <div className="flex justify-center py-6">
            <button
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
              className="px-6 py-2 bg-[#1e2231] border border-white/10 rounded-lg text-sm text-white/70 font-medium hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {/* Bet detail drawer */}
      {selectedBet && <BetDetailDrawer bet={selectedBet} onClose={() => setSelectedBet(null)} />}
    </div>
  );
};
