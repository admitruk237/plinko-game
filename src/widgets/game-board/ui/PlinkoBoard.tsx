'use client';

import { memo } from 'react';
import type { BallAnimation } from '@/entities/game';
import { useSettingsStore } from '@/entities/settings';
import { usePlaceBetStore } from '@/features/place-bet';
import { useGameConfig } from '@/features/game';
import { usePageTransition } from '@/shared/lib/page-transition-context';
import { usePlinkoBoard } from '../model/usePlinkoBoard';
import { BadgeBar } from './BadgeBar';

interface Props {
  currentAnimations: BallAnimation[];
  onAnimationEnd: (id: string) => void;
  onPegHit?: () => void;
}

const PlinkoBoardInner = ({ currentAnimations, onAnimationEnd, onPegHit }: Props) => {
  const rows = usePlaceBetStore((s) => s.rows);
  const risk = usePlaceBetStore((s) => s.risk);
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled);
  const { data: config } = useGameConfig();
  const payoutTable = config?.payoutTables[risk]?.[rows.toString()] ?? [];
  const { isTransitioning } = usePageTransition();

  const { canvasRef, containerRef, flashBuckets, dimensions, boardReady } = usePlinkoBoard({
    rows,
    currentAnimations,
    onAnimationEnd,
    onPegHit,
    animationsEnabled,
    isTransitioning,
  });

  return (
    <div ref={containerRef} className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <BadgeBar
        payoutTable={payoutTable}
        rows={rows}
        flashBuckets={flashBuckets}
        dimensions={dimensions}
        boardReady={boardReady}
      />
    </div>
  );
};

export const PlinkoBoard = memo(PlinkoBoardInner);
