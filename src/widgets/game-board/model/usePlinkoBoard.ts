'use client';

import { useEffect, useRef, useState } from 'react';
import type { BallAnimation } from '@/entities/game';
import {
  BADGE_INTRO_DELAY,
  BUCKET_FLASH_DURATION,
  PEG_GLOW_DURATION,
  PEG_INTRO_ROW_DELAY,
} from './constants';
import {
  type Dimensions,
  getBallRadius,
  getBallState,
  getPegPosition,
  getPegRadius,
} from './physics';

interface Props {
  rows: number;
  currentAnimations: BallAnimation[];
  onAnimationEnd: (id: string) => void;
  onPegHit?: () => void;
  animationsEnabled: boolean;
  isTransitioning: boolean;
}

export const usePlinkoBoard = ({
  rows,
  currentAnimations,
  onAnimationEnd,
  onPegHit,
  animationsEnabled,
  isTransitioning,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastHitPegRef = useRef<Map<string, string>>(new Map());
  const pegGlowRef = useRef<Map<string, number>>(new Map());
  const instantCompletedRef = useRef<Set<string>>(new Set());
  const [flashBuckets, setFlashBuckets] = useState<Map<number, number>>(new Map());
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  const [introRevealedRows, setIntroRevealedRows] = useState(0);
  const [boardReady, setBoardReady] = useState(false);
  const [prevRows, setPrevRows] = useState(rows);
  if (prevRows !== rows) {
    setPrevRows(rows);
    setIntroRevealedRows(0);
    setBoardReady(false);
  }

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

  useEffect(() => {
    if (isTransitioning) return;
    if (introRevealedRows >= rows) return;

    const timer = setTimeout(() => {
      setIntroRevealedRows((prev) => prev + 1);
    }, PEG_INTRO_ROW_DELAY);

    return () => clearTimeout(timer);
  }, [introRevealedRows, rows, isTransitioning]);

  useEffect(() => {
    if (introRevealedRows < rows) return;

    const timer = setTimeout(() => {
      setBoardReady(true);
    }, BADGE_INTRO_DELAY);

    return () => clearTimeout(timer);
  }, [introRevealedRows, rows]);

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
      const ballStates = new Map<string, ReturnType<typeof getBallState>>();

      for (const anim of currentAnimations) {
        if (finishedIds.has(anim.id)) continue;
        const state = getBallState(anim, now, dimensions, rows);
        ballStates.set(anim.id, state);

        if (state.nearPeg && onPegHit) {
          const pegKey = `${state.nearPeg.row}-${state.nearPeg.col}`;
          if (lastHitPegRef.current.get(anim.id) !== pegKey) {
            lastHitPegRef.current.set(anim.id, pegKey);
            onPegHit();
          }
        }

        if (state.nearPeg) {
          pegGlowRef.current.set(`${state.nearPeg.row}-${state.nearPeg.col}`, now);
        }
      }

      const pegRadius = getPegRadius(dimensions.width);
      for (let row = 0; row < rows; row++) {
        if (row >= introRevealedRows) continue;

        for (let col = 0; col < row + 2; col++) {
          const pos = getPegPosition(row, col, dimensions, rows);
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

      for (const anim of currentAnimations) {
        if (finishedIds.has(anim.id)) continue;
        const state = ballStates.get(anim.id);
        if (!state) continue;

        if (state.done) {
          finishedIds.add(anim.id);
          lastHitPegRef.current.delete(anim.id);
          setFlashBuckets((prev) => new Map(prev).set(anim.bucketIndex, Date.now()));
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
    onAnimationEnd,
    onPegHit,
    animationsEnabled,
    introRevealedRows,
  ]);

  return { canvasRef, containerRef, flashBuckets, dimensions, boardReady };
};
