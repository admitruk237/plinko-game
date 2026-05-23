'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Filter } from 'lucide-react';

import type { BetResponse } from '@/entities/game';
import { useBetHistory } from '@/features/bet-history';
import { ROUTES } from '@/shared/config';
import {
  DEFAULT_FILTER_VALUE,
  FILTER_ALL_VALUE,
  RISK_OPTIONS,
  ROW_OPTIONS,
} from './model/constants';
import {
  Button,
  MoveLeftIcon,
  type MoveLeftIconHandle,
  Select,
  SelectIcon,
  SelectItem,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';

import { BetTable } from './BetTable';

export const HistoryClient = () => {
  const [filterRows, setFilterRows] = useState<string>(DEFAULT_FILTER_VALUE);
  const [filterRisk, setFilterRisk] = useState<string>(DEFAULT_FILTER_VALUE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<MoveLeftIconHandle>(null);

  const rowsParam = filterRows !== FILTER_ALL_VALUE ? Number(filterRows) : undefined;
  const riskParam =
    filterRisk !== FILTER_ALL_VALUE ? (filterRisk as BetResponse['risk']) : undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useBetHistory(
    rowsParam,
    riskParam
  );

  const allBets = data?.pages.flatMap((p) => p.items) ?? [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleLoadMore();
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore]);

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
    return <BetTable bets={allBets} />;
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-transparent">
      <div className="max-w-[1232px] w-full mx-auto px-4 md:px-6 xl:px-0 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Button
              render={<Link href={ROUTES.GAME} />}
              nativeButton={false}
              variant="headerAction"
              size="none"
              onMouseEnter={() => iconRef.current?.startAnimation()}
              onMouseLeave={() => iconRef.current?.stopAnimation()}
            >
              <MoveLeftIcon ref={iconRef} size={16} />
              <span className="max-sm:hidden">Back to Game</span>
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-8 tracking-[0.07px]">
              Bet History
            </h1>
          </div>
        </header>

        {/* Filters Card */}
        <div className="mt-4 sm:mt-6 w-full bg-balance-bg border border-balance-border border-t-[#2A2F3E] rounded-[10px] py-3 px-3 sm:pt-[17px] sm:pr-[17px] sm:pb-[1px] sm:pl-[17px] opacity-100">
          <div className="flex items-center flex-nowrap gap-2 sm:gap-6 sm:flex-wrap pb-1 sm:pb-4">
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="w-4 h-4 text-white" />
              <span className="hidden sm:inline text-sm font-semibold text-white">Filters:</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-normal text-balance-label leading-4 tracking-normal font-sans">
                Risk:
              </span>
              <Select
                value={filterRisk}
                onValueChange={(val) => setFilterRisk(val ?? DEFAULT_FILTER_VALUE)}
              >
                <SelectTrigger className="w-[90px] sm:w-[120px]">
                  <SelectValue placeholder="All" />
                  <SelectIcon />
                </SelectTrigger>
                <SelectPortal>
                  <SelectPositioner side="bottom" align="start" sideOffset={4}>
                    <SelectPopup>
                      {RISK_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </SelectPositioner>
                </SelectPortal>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-normal text-balance-label leading-4 tracking-normal font-sans">
                Rows:
              </span>
              <Select
                value={filterRows}
                onValueChange={(val) => setFilterRows(val ?? DEFAULT_FILTER_VALUE)}
              >
                <SelectTrigger className="w-[80px] sm:w-[100px]">
                  <SelectValue placeholder="All" />
                  <SelectIcon />
                </SelectTrigger>
                <SelectPortal>
                  <SelectPositioner side="bottom" align="start" sideOffset={4}>
                    <SelectPopup>
                      {ROW_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </SelectPositioner>
                </SelectPortal>
              </Select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="mt-6 w-full pb-10">
          {renderBets()}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="py-4 flex justify-center">
            {isFetchingNextPage && (
              <svg className="animate-spin h-5 w-5 text-white/40" viewBox="0 0 24 24">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
