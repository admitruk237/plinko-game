import {
  BADGE_HEIGHT,
  BASE_STEP_MS,
  DESKTOP_BADGE_BOTTOM_OFFSET,
  HOP_HEIGHT,
  MOBILE_BADGE_BOTTOM_OFFSET,
  MOBILE_BREAKPOINT,
  SETTLE_DURATION,
  TOP_PADDING,
} from './constants';

export interface Dimensions {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface BallState {
  x: number;
  y: number;
  opacity: number;
  bounceFactor: number;
  nearPeg: { row: number; col: number } | null;
  done: boolean;
}

// ── Geometry helpers ─────────────────────────────────────────────────────────

export const getPegRadius = (width: number): number => {
  return width < 480 ? 3 : 4;
};

export const getBallRadius = (width: number): number => {
  return width < 480 ? 4.5 : 6;
};

export const getSideMargin = (width: number): number => {
  if (width < 480) return 40;
  if (width < 768) return 120;
  return 280;
};

const getBottomGap = (width: number): number => {
  if (width < 480) return 16;
  if (width < 768) return 40;
  return 76;
};

// Column spacing — same formula used for both pegs and badges
export const getColSpacing = (width: number, rows: number): number => {
  return (width - getSideMargin(width)) / (rows + 1);
};

// ── Time helpers ─────────────────────────────────────────────────────────────

// Steps get faster as the ball falls (sqrt dampening)
export const getStepDuration = (row: number, width: number): number => {
  const mobileFactor = width < 480 ? 1.18 : 1;
  return (BASE_STEP_MS * mobileFactor) / Math.sqrt(row + 1);
};

export const getCumulativeTime = (upToRow: number, width: number): number => {
  let t = 0;
  for (let r = 0; r < upToRow; r++) t += getStepDuration(r, width);
  return t;
};

// ── Position calculators ─────────────────────────────────────────────────────

export const getPegPosition = (
  row: number,
  col: number,
  dims: Dimensions,
  rows: number
): Position => {
  const { width, height } = dims;
  if (!width || !height) return { x: 0, y: 0 };

  const badgeOffset =
    width < MOBILE_BREAKPOINT ? MOBILE_BADGE_BOTTOM_OFFSET : DESKTOP_BADGE_BOTTOM_OFFSET;
  const availableHeight = height - badgeOffset - BADGE_HEIGHT - TOP_PADDING - getBottomGap(width);
  const rowSpacing = availableHeight / rows;
  const colSpacing = getColSpacing(width, rows);
  const rowWidth = (row + 1) * colSpacing;
  const startX = (width - rowWidth) / 2;

  return { x: startX + col * colSpacing, y: TOP_PADDING + (row + 1) * rowSpacing };
};

// Ball settles into center of the badge bar
export const getBucketPosition = (index: number, dims: Dimensions, rows: number): Position => {
  const { width, height } = dims;
  if (!width || !height) return { x: 0, y: 0 };

  const badgeOffset =
    width < MOBILE_BREAKPOINT ? MOBILE_BADGE_BOTTOM_OFFSET : DESKTOP_BADGE_BOTTOM_OFFSET;
  const colSpacing = getColSpacing(width, rows);
  const startX = getSideMargin(width) / 2;

  return { x: startX + index * colSpacing, y: height - badgeOffset - BADGE_HEIGHT / 2 };
};

// ── Ball state at a given timestamp ──────────────────────────────────────────

export const getBallState = (
  anim: { path: string; bucketIndex: number; startTime: number },
  now: number,
  dims: Dimensions,
  rows: number
): BallState => {
  const { path, bucketIndex, startTime } = anim;
  const elapsed = now - startTime;

  if (!dims.width || !dims.height) {
    return { x: 0, y: 0, opacity: 1, bounceFactor: 0, nearPeg: null, done: false };
  }

  const pegRadius = getPegRadius(dims.width);
  let timeAccum = 0;

  // Find which peg-to-peg segment the ball is currently in
  for (let r = 0; r < path.length; r++) {
    const dur = getStepDuration(r, dims.width);

    if (timeAccum + dur > elapsed) {
      const localT = (elapsed - timeAccum) / dur; // 0..1 progress within this step

      let curCol = 0;
      for (let i = 0; i < r; i++) curCol += path[i] === 'R' ? 1 : 0;

      const nextCol = curCol + (path[r] === 'R' ? 1 : 0);
      const toPeg = getPegPosition(r, nextCol, dims, rows);

      let fromX: number;
      let fromY: number;

      if (r === 0) {
        fromX = dims.width / 2; // drops from center top
        fromY = 10;
      } else {
        const prevPeg = getPegPosition(r - 1, curCol, dims, rows);
        const deflectDir = path[r] === 'R' ? 1 : -1;
        fromX = prevPeg.x + deflectDir * (pegRadius + 2); // offset from peg edge
        fromY = prevPeg.y + pegRadius + 2;
      }

      const x = fromX + (toPeg.x - fromX) * localT;
      const hop = r > 0 ? Math.sin(localT * Math.PI) * HOP_HEIGHT : 0; // parabolic arc
      const y = fromY + (toPeg.y - fromY) * (localT * localT) - hop; // quadratic fall

      return {
        x,
        y,
        opacity: 1,
        bounceFactor: r > 0 ? Math.max(0, 1 - localT / 0.28) : 0, // squish on peg hit
        nearPeg: localT > 0.7 ? { row: r, col: nextCol } : null, // trigger glow near landing
        done: false,
      };
    }

    timeAccum += dur;
  }

  // Ball has finished path — settle into bucket with eased motion and fade
  const settleElapsed = elapsed - getCumulativeTime(path.length, dims.width);
  const settleT = Math.min(settleElapsed / SETTLE_DURATION, 1);
  const settleEased = 1 - Math.pow(1 - settleT, 3); // ease-out cubic

  let lastCol = 0;
  for (let i = 0; i < path.length; i++) lastCol += path[i] === 'R' ? 1 : 0;

  const lastPeg = getPegPosition(path.length - 1, lastCol, dims, rows);
  const bucket = getBucketPosition(bucketIndex, dims, rows);

  return {
    x: lastPeg.x + (bucket.x - lastPeg.x) * settleEased,
    y: lastPeg.y + (bucket.y - lastPeg.y) * settleEased,
    opacity: settleT > 0.6 ? 1 - (settleT - 0.6) / 0.4 : 1, // fade in last 40%
    bounceFactor: 0,
    nearPeg: null,
    done: elapsed >= getCumulativeTime(path.length, dims.width) + SETTLE_DURATION,
  };
};
