'use client';

import { motion, useAnimation, type Variants } from 'motion/react';
import { forwardRef, type HTMLAttributes, useCallback, useImperativeHandle, useRef } from 'react';
import { cn } from '@/shared/lib/utils';

export interface ArrowLeftIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const DEFAULT_SIZE = 28;
const ANIMATION_DURATION = 0.4;
const SVG_VIEWBOX = '0 0 24 24';
const STROKE_WIDTH = '2';
const ANIMATION_KEY = 'animate';
const NORMAL_KEY = 'normal';

const PATH_D = 'm12 19-7-7 7-7';
const SECOND_PATH_D = 'M19 12H5';

const PATH_VARIANTS: Variants = {
  normal: { x: 0 },
  animate: {
    x: [0, -4, 0],
    transition: {
      duration: ANIMATION_DURATION,
      ease: 'easeInOut',
    },
  },
};

const SECOND_PATH_VARIANTS: Variants = {
  normal: { x: 0 },
  animate: {
    x: [0, -4, 0],
    transition: {
      duration: ANIMATION_DURATION,
      ease: 'easeInOut',
    },
  },
};

export const ArrowLeftIcon = forwardRef<ArrowLeftIconHandle, Props>(
  ({ onMouseEnter, onMouseLeave, className, size = DEFAULT_SIZE, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => {
          void controls.start(ANIMATION_KEY);
        },
        stopAnimation: () => {
          void controls.start(NORMAL_KEY);
        },
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          void controls.start(ANIMATION_KEY);
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          void controls.start(NORMAL_KEY);
        }
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={STROKE_WIDTH}
          viewBox={SVG_VIEWBOX}
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path animate={controls} d={PATH_D} variants={PATH_VARIANTS} />
          <motion.path animate={controls} d={SECOND_PATH_D} variants={SECOND_PATH_VARIANTS} />
        </svg>
      </div>
    );
  }
);

ArrowLeftIcon.displayName = 'ArrowLeftIcon';
