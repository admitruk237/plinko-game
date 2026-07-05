'use client';

import { ROUTES } from '@/shared/config';
import { BottomNav, Header } from '@/widgets';
import { LoadingState } from '@/shared/ui';
import { BetTable } from './BetTable';
import { useHistory } from './model/useHistory';
import { HistoryFilters } from './ui/HistoryFilters';
import { motion } from 'motion/react';
import { usePageTransition } from '@/shared/lib/page-transition-context';

const LOADING_HISTORY_MESSAGE = 'Loading history...';

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export const HistoryClient = () => {
  const {
    filterRows,
    filterRisk,
    allBets,
    isLoading,
    isFetchingNextPage,
    sentinelRef,
    setFilterRows,
    setFilterRisk,
  } = useHistory();
  const { isTransitioning } = usePageTransition();

  const renderBets = () => {
    if (isLoading) {
      return <LoadingState message={LOADING_HISTORY_MESSAGE} fullScreen={false} />;
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
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <Header
        title="Bet History"
        showBackButton
        backRoute={ROUTES.GAME}
        variant="subpage"
        maxWidthClassName="max-w-[1232px]"
      />
      <div className="flex-1 overflow-y-auto w-full bg-transparent">
        <div className="max-w-[1232px] w-full mx-auto px-4 md:px-6 xl:px-0 flex flex-col pb-10 pt-4">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isTransitioning ? 'hidden' : 'visible'}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <HistoryFilters
              filterRisk={filterRisk}
              filterRows={filterRows}
              onRiskChange={setFilterRisk}
              onRowsChange={setFilterRows}
            />
          </motion.div>

          <motion.div
            className="mt-6 w-full pb-10"
            variants={itemVariants}
            initial="hidden"
            animate={isTransitioning ? 'hidden' : 'visible'}
            transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          >
            {renderBets()}

            <div ref={sentinelRef} className="py-4 flex justify-center">
              {isFetchingNextPage && (
                <LoadingState message="" fullScreen={false} className="py-0" />
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};
