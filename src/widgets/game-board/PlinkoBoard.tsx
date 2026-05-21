'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BallAnimation, Risk } from '@/entities/game/model/types';
import { getMultiplierHex } from '@/shared/lib/multiplier-color';

interface Props {
  rows: number;
  risk: Risk;
  payoutTable: number[];
  currentAnimations: BallAnimation[];
  onAnimationEnd: (id: string) => void;
}

const BADGE_HEIGHT = 56;
const TOP_PADDING = 24;
const PEG_RADIUS = 4;
const BALL_RADIUS = 6;
const BOTTOM_GAP = 16;

function getSideMargin(width: number): number {
  if (width < 480) return 40;
  if (width < 768) return 120;
  return 280;
}
const SETTLE_DURATION = 320;
const BUCKET_FLASH_DURATION = 500;

const BASE_STEP_MS = 340;
function getStepDuration(row: number): number {
  return BASE_STEP_MS / Math.sqrt(row + 1);
}

function getCumulativeTime(upToRow: number): number {
  let t = 0;
  for (let r = 0; r < upToRow; r++) t += getStepDuration(r);
  return t;
}

// Shared column spacing — same formula for pegs and badges
function getColSpacing(width: number, rows: number): number {
  return (width - getSideMargin(width)) / (rows + 1);
}

interface BallState {
  x: number;
  y: number;
  opacity: number;
  bounceFactor: number;
  nearPeg: { row: number; col: number } | null;
  done: boolean;
}

export const PlinkoBoard = ({
  rows,
  risk,
  payoutTable,
  currentAnimations,
  onAnimationEnd,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const [flashBuckets, setFlashBuckets] = useState<Map<number, number>>(new Map());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const getPegPosition = useCallback(
    (row: number, col: number) => {
      const { width, height } = dimensions;
      if (!width || !height) return { x: 0, y: 0 };
      // Divide by rows (not rows+1) so last peg sits right at the badge bar top
      const availableHeight = height - BADGE_HEIGHT - TOP_PADDING - BOTTOM_GAP;
      const rowSpacing = availableHeight / rows;
      const colSpacing = getColSpacing(width, rows);
      const pegsInRow = row + 2;
      const rowWidth = (pegsInRow - 1) * colSpacing;
      const startX = (width - rowWidth) / 2;
      return { x: startX + col * colSpacing, y: TOP_PADDING + (row + 1) * rowSpacing };
    },
    [dimensions, rows]
  );

  // Bucket center is inside the badge bar so ball visually falls into it
  const getBucketPosition = useCallback(
    (index: number) => {
      const { width, height } = dimensions;
      if (!width || !height) return { x: 0, y: 0 };
      const colSpacing = getColSpacing(width, rows);
      const startX = getSideMargin(width) / 2;
      return { x: startX + index * colSpacing, y: height - BADGE_HEIGHT / 2 };
    },
    [dimensions, rows]
  );

  const getBallState = useCallback(
    (anim: BallAnimation, now: number): BallState => {
      const { path, bucketIndex, startTime } = anim;
      const elapsed = now - startTime;

      if (!dimensions.width || !dimensions.height) {
        return { x: 0, y: 0, opacity: 1, bounceFactor: 0, nearPeg: null, done: false };
      }

      let timeAccum = 0;

      for (let r = 0; r < path.length; r++) {
        const dur = getStepDuration(r);

        if (timeAccum + dur > elapsed) {
          const localT = (elapsed - timeAccum) / dur;

          let curCol = 0;
          for (let i = 0; i < r; i++) curCol += path[i] === 'R' ? 1 : 0;

          const nextCol = curCol + (path[r] === 'R' ? 1 : 0);
          const toPeg = getPegPosition(r, nextCol);

          let fromX: number;
          let fromY: number;

          if (r === 0) {
            fromX = dimensions.width / 2;
            fromY = 10;
          } else {
            const prevPeg = getPegPosition(r - 1, curCol);
            const deflectDir = path[r] === 'R' ? 1 : -1;
            fromX = prevPeg.x + deflectDir * (PEG_RADIUS + 2);
            fromY = prevPeg.y + PEG_RADIUS + 2;
          }

          const x = fromX + (toPeg.x - fromX) * localT;
          const y = fromY + (toPeg.y - fromY) * (localT * localT);
          const bounceFactor = r > 0 ? Math.max(0, 1 - localT / 0.18) : 0;
          const nearPeg = localT > 0.7 ? { row: r, col: nextCol } : null;

          return { x, y, opacity: 1, bounceFactor, nearPeg, done: false };
        }

        timeAccum += dur;
      }

      // Settling into bucket — ball fades as it "enters" the badge
      const settleElapsed = elapsed - getCumulativeTime(path.length);
      const settleT = Math.min(settleElapsed / SETTLE_DURATION, 1);
      const settleEased = 1 - Math.pow(1 - settleT, 3);

      let lastCol = 0;
      for (let i = 0; i < path.length; i++) lastCol += path[i] === 'R' ? 1 : 0;
      const lastPeg = getPegPosition(path.length - 1, lastCol);
      const bucket = getBucketPosition(bucketIndex);

      // Fade out in last 40% of settle so ball disappears into badge
      const opacity = settleT > 0.6 ? 1 - (settleT - 0.6) / 0.4 : 1;

      return {
        x: lastPeg.x + (bucket.x - lastPeg.x) * settleEased,
        y: lastPeg.y + (bucket.y - lastPeg.y) * settleEased,
        opacity,
        bounceFactor: 0,
        nearPeg: null,
        done: elapsed >= getCumulativeTime(path.length) + SETTLE_DURATION,
      };
    },
    [dimensions, getPegPosition, getBucketPosition]
  );

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const finishedIds = new Set<string>();

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = dimensions.width * 2;
      canvas.height = dimensions.height * 2;
      ctx.scale(2, 2);
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const now = Date.now();

      const glowPegs = new Set<string>();
      const ballStatesMap = new Map<string, BallState>();

      for (const anim of currentAnimations) {
        if (finishedIds.has(anim.id)) continue;
        const state = getBallState(anim, now);
        ballStatesMap.set(anim.id, state);
        if (state.nearPeg) {
          glowPegs.add(`${state.nearPeg.row}-${state.nearPeg.col}`);
        }
      }

      // Draw pegs
      for (let row = 0; row < rows; row++) {
        const pegsInRow = row + 2;
        for (let col = 0; col < pegsInRow; col++) {
          const pos = getPegPosition(row, col);
          const isGlowing = glowPegs.has(`${row}-${col}`);

          if (isGlowing) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, PEG_RADIUS + 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.18)';
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, PEG_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = isGlowing ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)';
          ctx.fill();
        }
      }

      // Draw balls
      for (const anim of currentAnimations) {
        if (finishedIds.has(anim.id)) continue;

        const state = ballStatesMap.get(anim.id);
        if (!state) continue;

        if (state.done && !finishedIds.has(anim.id)) {
          finishedIds.add(anim.id);
          setFlashBuckets((prev) => {
            const next = new Map(prev);
            next.set(anim.bucketIndex, Date.now());
            return next;
          });
          setTimeout(() => {
            setFlashBuckets((prev) => {
              const next = new Map(prev);
              next.delete(anim.bucketIndex);
              return next;
            });
            onAnimationEnd(anim.id);
          }, BUCKET_FLASH_DURATION);
          continue;
        }

        const { x, y, opacity, bounceFactor } = state;
        const r = BALL_RADIUS * (1 + bounceFactor * 0.4);

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = 'screen';

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
        gradient.addColorStop(0, 'rgba(255,255,255,0.85)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,0.4)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [dimensions, rows, currentAnimations, getPegPosition, getBallState, onAnimationEnd]);

  return (
    <div ref={containerRef} className="relative flex-1 flex flex-col">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Badge bar — aligned with peg columns via SIDE_MARGIN */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center gap-px"
        style={{
          height: BADGE_HEIGHT,
          paddingLeft: getSideMargin(dimensions.width) / 2,
          paddingRight: getSideMargin(dimensions.width) / 2,
        }}
      >
        {payoutTable.map((multiplier, index) => {
          const isFlashing = flashBuckets.has(index);
          const hex = getMultiplierHex(multiplier);

          return (
            <div
              key={`${risk}-${rows}-${index}`}
              className={`flex flex-1 items-center justify-center rounded-[10px] border-2 h-[40px] px-3 py-2 text-[14px] font-bold leading-[20px] tracking-[-0.15px] transition-all duration-200 ${isFlashing ? 'scale-105 brightness-125' : ''}`}
              style={{
                backgroundColor: `${hex}33`,
                borderColor: hex,
                color: hex,
              }}
            >
              {multiplier}x
            </div>
          );
        })}
      </div>
    </div>
  );
};
