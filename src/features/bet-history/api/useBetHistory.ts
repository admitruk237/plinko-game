import { useInfiniteQuery } from '@tanstack/react-query';
import { bffApi } from '@/shared/api';
import type { BetListResponse } from '@/entities/game';
import { DEFAULT_PAGE_LIMIT } from '@/shared/config';

export const useBetHistory = (rows?: number) => {
  return useInfiniteQuery<BetListResponse>({
    queryKey: ['bets', { rows }],
    queryFn: ({ pageParam }) =>
      bffApi.getBets({
        limit: DEFAULT_PAGE_LIMIT,
        cursor: pageParam as string | null,
        rows,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
