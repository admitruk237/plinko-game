'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BallAnimation, Risk } from '@/entities/game';
import { getMultiplierHex } from '@/shared/lib/multiplier-color';

interface Props {
  rows: number;
  risk: Risk;
  payoutTable: number[];
  currentAnimations: BallAnimation[];
  onAnimationEnd: (id: string) => void;
  onPegHit?: () => void;
  animationsEnabled: boolean;
}

const BADGE_HEIGHT = 56;
const MOBILE_BREAKPOINT = 768;
const MOBILE_BADGE_BOTTOM_OFFSET = 168;
const DESKTOP_BADGE_BOTTOM_OFFSET = 20;
const TOP_PADDING = 24;

// Badge scaling configurations
const BADGE_SPACING_SMALL = 35;
const BADGE_SPACING_MEDIUM = 45;
const BADGE_SPACING_LARGE = 55;

const FONT_SIZE_XSMALL = 7;
const FONT_SIZE_SMALL = 8;
const FONT_SIZE_MOBILE_DEFAULT = 9;
const FONT_SIZE_MEDIUM = 10;
const FONT_SIZE_LARGE = 12;
const FONT_SIZE_DESKTOP_DEFAULT = 14;

const BADGE_HEIGHT_XSMALL = 26;
const BADGE_HEIGHT_SMALL = 30;
const BADGE_HEIGHT_MEDIUM = 34;
const BADGE_HEIGHT_DEFAULT = 40;

const BADGE_PADDING_ZERO = 0;
const BADGE_PADDING_XSMALL = 2;
const BADGE_PADDING_SMALL = 4;
const BADGE_PADDING_MEDIUM = 8;
const BADGE_PADDING_DEFAULT = 12;

const RADIUS_SMALL = 4;
const RADIUS_MEDIUM = 6;
const RADIUS_LARGE = 8;
const RADIUS_DEFAULT = 10;

const BORDER_WIDTH_THIN = 1;
const BORDER_WIDTH_THICK = 2;
function getPegRadius(width: number): number {
  return width < 480 ? 3 : 4;
}
function getBallRadius(width: number): number {
  return width < 480 ? 4.5 : 6;
}
function getSideMargin(width: number): number {
  if (width < 480) return 40;
  if (width < 768) return 120;
  return 280;
}

function getBottomGap(width: number): number {
  if (width < 480) return 16;
  if (width < 768) return 40;
  return 76;
}
const SETTLE_DURATION = 320;
const BUCKET_FLASH_DURATION = 500;
const PEG_GLOW_DURATION = 380;
const HOP_HEIGHT = 9;

const BASE_STEP_MS = 420;
function getStepDuration(row: number, width: number): number {
  const mobileFactor = width < 480 ? 1.18 : 1;
  return (BASE_STEP_MS * mobileFactor) / Math.sqrt(row + 1);
}

function getCumulativeTime(upToRow: number, width: number): number {
  let t = 0;
  for (let r = 0; r < upToRow; r++) t += getStepDuration(r, width);
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
  onPegHit,
  animationsEnabled,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastHitPegRef = useRef<Map<string, string>>(new Map());
  const pegGlowRef = useRef<Map<string, number>>(new Map());
  const instantCompletedRef = useRef<Set<string>>(new Set());
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

  const getBadgeStyle = (multiplier: number, index: number) => {
    const isFlashing = flashBuckets.has(index);
    const hex = getMultiplierHex(multiplier);
    const { width } = dimensions;

    if (!width) {
      return {
        backgroundColor: `${hex}33`,
        borderColor: hex,
        color: hex,
      };
    }

    const colSpacing = getColSpacing(width, rows);

    let fontSize = FONT_SIZE_DESKTOP_DEFAULT;
    let height = BADGE_HEIGHT_DEFAULT;
    let px = BADGE_PADDING_DEFAULT;
    let borderRadius = RADIUS_DEFAULT;
    let borderWidth = BORDER_WIDTH_THICK;

    if (width < MOBILE_BREAKPOINT) {
      fontSize = rows >= 14 ? FONT_SIZE_XSMALL : FONT_SIZE_MOBILE_DEFAULT;
      height = BADGE_HEIGHT_XSMALL;
      px = BADGE_PADDING_ZERO;
      borderRadius = RADIUS_SMALL;
      borderWidth = BORDER_WIDTH_THIN;
    } else {
      if (colSpacing < BADGE_SPACING_SMALL) {
        fontSize = FONT_SIZE_SMALL;
        height = BADGE_HEIGHT_XSMALL;
        px = BADGE_PADDING_XSMALL;
        borderRadius = RADIUS_SMALL;
        borderWidth = BORDER_WIDTH_THIN;
      } else if (colSpacing < BADGE_SPACING_MEDIUM) {
        fontSize = FONT_SIZE_MEDIUM;
        height = BADGE_HEIGHT_SMALL;
        px = BADGE_PADDING_SMALL;
        borderRadius = RADIUS_MEDIUM;
        borderWidth = BORDER_WIDTH_THIN;
      } else if (colSpacing < BADGE_SPACING_LARGE) {
        fontSize = FONT_SIZE_LARGE;
        height = BADGE_HEIGHT_MEDIUM;
        px = BADGE_PADDING_MEDIUM;
        borderRadius = RADIUS_LARGE;
        borderWidth = BORDER_WIDTH_THICK;
      }
    }

    return {
      backgroundColor: `${hex}33`,
      borderColor: hex,
      color: hex,
      fontSize: `${fontSize}px`,
      height: `${height}px`,
      paddingLeft: `${px}px`,
      paddingRight: `${px}px`,
      borderRadius: `${borderRadius}px`,
      borderWidth: `${borderWidth}px`,
      transform: isFlashing ? 'scale(1.05)' : 'none',
      filter: isFlashing ? 'brightness(1.25)' : 'none',
    };
  };

  const getBadgeBarGapClass = () => {
    const { width } = dimensions;
    if (!width) return 'gap-1';
    if (width < MOBILE_BREAKPOINT) return 'gap-[2px]';
    const colSpacing = getColSpacing(width, rows);
    if (colSpacing < BADGE_SPACING_MEDIUM) return 'gap-[2px]';
    return 'gap-1';
  };

  const getPegPosition = useCallback(
    (row: number, col: number) => {
      const { width, height } = dimensions;
      if (!width || !height) return { x: 0, y: 0 };
      const badgeBottomOffset =
        width < MOBILE_BREAKPOINT ? MOBILE_BADGE_BOTTOM_OFFSET : DESKTOP_BADGE_BOTTOM_OFFSET;
      // Available vertical space: from TOP_PADDING down to badge bar top minus gap
      const availableHeight =
        height - badgeBottomOffset - BADGE_HEIGHT - TOP_PADDING - getBottomGap(width);
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
      const badgeBottomOffset =
        width < MOBILE_BREAKPOINT ? MOBILE_BADGE_BOTTOM_OFFSET : DESKTOP_BADGE_BOTTOM_OFFSET;
      const colSpacing = getColSpacing(width, rows);
      const startX = getSideMargin(width) / 2;
      // Ball settles into center of badge bar
      return { x: startX + index * colSpacing, y: height - badgeBottomOffset - BADGE_HEIGHT / 2 };
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

      const pegRadius = getPegRadius(dimensions.width);
      let timeAccum = 0;

      for (let r = 0; r < path.length; r++) {
        const dur = getStepDuration(r, dimensions.width);

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
            fromX = prevPeg.x + deflectDir * (pegRadius + 2);
            fromY = prevPeg.y + pegRadius + 2;
          }

          const x = fromX + (toPeg.x - fromX) * localT;
          const hop = r > 0 ? Math.sin(localT * Math.PI) * HOP_HEIGHT : 0;
          const y = fromY + (toPeg.y - fromY) * (localT * localT) - hop;
          const bounceFactor = r > 0 ? Math.max(0, 1 - localT / 0.28) : 0;
          const nearPeg = localT > 0.7 ? { row: r, col: nextCol } : null;

          return { x, y, opacity: 1, bounceFactor, nearPeg, done: false };
        }

        timeAccum += dur;
      }

      // Settling into bucket — ball fades as it "enters" the badge
      const settleElapsed = elapsed - getCumulativeTime(path.length, dimensions.width);
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
        done: elapsed >= getCumulativeTime(path.length, dimensions.width) + SETTLE_DURATION,
      };
    },
    [dimensions, getPegPosition, getBucketPosition]
  );

  // Instantly complete animations when animations are disabled
  useEffect(() => {
    if (animationsEnabled) return;
    for (const anim of currentAnimations) {
      if (instantCompletedRef.current.has(anim.id)) continue;
      instantCompletedRef.current.add(anim.id);
      onAnimationEnd(anim.id);
    }
  }, [currentAnimations, animationsEnabled, onAnimationEnd]);

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

        if (state.nearPeg && onPegHit) {
          const pegKey = `${state.nearPeg.row}-${state.nearPeg.col}`;
          if (lastHitPegRef.current.get(anim.id) !== pegKey) {
            lastHitPegRef.current.set(anim.id, pegKey);
            onPegHit();
          }
        }

        if (state.nearPeg) {
          glowPegs.add(`${state.nearPeg.row}-${state.nearPeg.col}`);
          pegGlowRef.current.set(`${state.nearPeg.row}-${state.nearPeg.col}`, now);
        }
      }

      // Draw pegs
      const pegRadius = getPegRadius(dimensions.width);
      for (let row = 0; row < rows; row++) {
        const pegsInRow = row + 2;
        for (let col = 0; col < pegsInRow; col++) {
          const pos = getPegPosition(row, col);
          const hitTime = pegGlowRef.current.get(`${row}-${col}`);
          const glow = hitTime ? Math.max(0, 1 - (now - hitTime) / PEG_GLOW_DURATION) : 0;

          if (glow > 0) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, pegRadius + 5 * glow, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${0.18 * glow})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pegRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.55 * glow})`;
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
          lastHitPegRef.current.delete(anim.id);
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
        const r = getBallRadius(dimensions.width) * (1 + bounceFactor * 0.6);

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = 'screen';

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r * 1.8);
        gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
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
  }, [
    dimensions,
    rows,
    currentAnimations,
    getPegPosition,
    getBallState,
    onAnimationEnd,
    onPegHit,
    animationsEnabled,
  ]);

  return (
    <div ref={containerRef} className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Badge bar — aligned with peg columns via SIDE_MARGIN */}
      <div
        className={`absolute left-0 right-0 flex items-center ${getBadgeBarGapClass()}`}
        style={{
          bottom:
            dimensions.width < MOBILE_BREAKPOINT
              ? MOBILE_BADGE_BOTTOM_OFFSET
              : DESKTOP_BADGE_BOTTOM_OFFSET,
          height: BADGE_HEIGHT,
          paddingLeft: getSideMargin(dimensions.width) / 2,
          paddingRight: getSideMargin(dimensions.width) / 2,
        }}
      >
        {payoutTable.map((multiplier, index) => (
          <div
            key={`${risk}-${rows}-${index}`}
            className="flex flex-1 items-center justify-center border font-bold leading-none tracking-[-0.15px] transition-all duration-200"
            style={getBadgeStyle(multiplier, index)}
          >
            {multiplier}x
          </div>
        ))}
      </div>
    </div>
  );
};
