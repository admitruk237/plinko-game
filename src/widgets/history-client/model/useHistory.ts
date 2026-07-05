'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BetResponse } from '@/entities/game';
import { useBetHistory } from '@/features/bet-history';
import { DEFAULT_FILTER_VALUE, FILTER_ALL_VALUE } from './constants';

export const useHistory = () => {
  const [filterRows, setFilterRows] = useState<string>(DEFAULT_FILTER_VALUE);
  const [filterRisk, setFilterRisk] = useState<string>(DEFAULT_FILTER_VALUE);
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  return {
    filterRows,
    filterRisk,
    allBets,
    isLoading,
    isFetchingNextPage,
    sentinelRef,
    setFilterRows,
    setFilterRisk,
  };
};
