'use client';

import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Risk } from '@/entities/game';
import { getMultiplierHex } from '@/shared/lib/multiplier-color';
import {
  BADGE_HEIGHT,
  BADGE_HEIGHT_DEFAULT,
  BADGE_HEIGHT_MEDIUM,
  BADGE_HEIGHT_SMALL,
  BADGE_HEIGHT_XSMALL,
  BADGE_PADDING_DEFAULT,
  BADGE_PADDING_MEDIUM,
  BADGE_PADDING_SMALL,
  BADGE_PADDING_XSMALL,
  BADGE_PADDING_ZERO,
  BADGE_SPACING_LARGE,
  BADGE_SPACING_MEDIUM,
  BADGE_SPACING_SMALL,
  BORDER_WIDTH_THICK,
  BORDER_WIDTH_THIN,
  DESKTOP_BADGE_BOTTOM_OFFSET,
  FONT_SIZE_DESKTOP_DEFAULT,
  FONT_SIZE_LARGE,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_MOBILE_DEFAULT,
  FONT_SIZE_SMALL,
  FONT_SIZE_XSMALL,
  MOBILE_BADGE_BOTTOM_OFFSET,
  MOBILE_BREAKPOINT,
  RADIUS_DEFAULT,
  RADIUS_LARGE,
  RADIUS_MEDIUM,
  RADIUS_SMALL,
} from '../model/constants';
import { type Dimensions, getColSpacing, getSideMargin } from '../model/physics';

const BADGE_STAGGER_DELAY = 0.03;

interface Props {
  payoutTable: number[];
  rows: number;
  risk: Risk;
  flashBuckets: Map<number, number>;
  dimensions: Dimensions;
  boardReady: boolean;
}

const getBadgeStyle = (
  multiplier: number,
  index: number,
  rows: number,
  flashBuckets: Map<number, number>,
  dims: Dimensions
): CSSProperties => {
  const hex = getMultiplierHex(multiplier);
  const { width } = dims;

  if (!width) return { backgroundColor: `${hex}33`, borderColor: hex, color: hex };

  const colSpacing = getColSpacing(width, rows);
  const isFlashing = flashBuckets.has(index);

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
  } else if (colSpacing < BADGE_SPACING_SMALL) {
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

const getGapClass = (dims: Dimensions, rows: number): string => {
  const { width } = dims;
  if (!width || width < MOBILE_BREAKPOINT) return 'gap-[2px]';
  return getColSpacing(width, rows) < BADGE_SPACING_MEDIUM ? 'gap-[2px]' : 'gap-1';
};

export const BadgeBar = ({
  payoutTable,
  rows,
  risk,
  flashBuckets,
  dimensions,
  boardReady,
}: Props) => {
  const badgeOffset =
    dimensions.width < MOBILE_BREAKPOINT ? MOBILE_BADGE_BOTTOM_OFFSET : DESKTOP_BADGE_BOTTOM_OFFSET;
  const sideMargin = getSideMargin(dimensions.width) / 2;

  return (
    <div
      className={`absolute left-0 right-0 flex items-center ${getGapClass(dimensions, rows)}`}
      style={{
        bottom: badgeOffset,
        height: BADGE_HEIGHT,
        paddingLeft: sideMargin,
        paddingRight: sideMargin,
      }}
    >
      <AnimatePresence mode="sync">
        {boardReady &&
          payoutTable.map((multiplier, index) => (
            <motion.div
              key={`${risk}-${rows}-${index}`}
              className="flex flex-1 items-center justify-center border font-bold leading-none tracking-[-0.15px] transition-[transform,filter] duration-200"
              style={getBadgeStyle(multiplier, index, rows, flashBuckets, dimensions)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
                delay: index * BADGE_STAGGER_DELAY,
              }}
            >
              {multiplier}x
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};
