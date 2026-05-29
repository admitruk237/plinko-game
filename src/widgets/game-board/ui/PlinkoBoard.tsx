'use client';

import type { BallAnimation, Risk } from '@/entities/game';
import { usePlinkoBoard } from '../model/usePlinkoBoard';
import { BadgeBar } from './BadgeBar';

interface Props {
  rows: number;
  risk: Risk;
  payoutTable: number[];
  currentAnimations: BallAnimation[];
  onAnimationEnd: (id: string) => void;
  onPegHit?: () => void;
  animationsEnabled: boolean;
}

export const PlinkoBoard = ({
  rows,
  risk,
  payoutTable,
  currentAnimations,
  onAnimationEnd,
  onPegHit,
  animationsEnabled,
}: Props) => {
  const { canvasRef, containerRef, flashBuckets, dimensions } = usePlinkoBoard({
    rows,
    currentAnimations,
    onAnimationEnd,
    onPegHit,
    animationsEnabled,
  });

  return (
    <div ref={containerRef} className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <BadgeBar
        payoutTable={payoutTable}
        rows={rows}
        risk={risk}
        flashBuckets={flashBuckets}
        dimensions={dimensions}
      />
    </div>
  );
};
