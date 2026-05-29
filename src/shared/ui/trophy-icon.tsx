'use client';

import { motion, useAnimation, type Variants } from 'motion/react';
import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { cn } from '@/shared/lib/utils';

export interface TrophyIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const WOBBLE_VARIANTS: Variants = {
  normal: {
    rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 10 },
  },
  animate: {
    rotate: [0, -8, 8, -8, 8, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

const TrophyIcon = forwardRef<TrophyIconHandle, Props>(
  ({ onMouseEnter, onMouseLeave, className, size = 20, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      };
    });

    const handleMouseEnter = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start('animate');
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start('normal');
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
        <motion.svg
          variants={WOBBLE_VARIANTS}
          animate={controls}
          initial="normal"
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.67"
          viewBox="0 0 20 20"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
          style={{ originX: '50%', originY: '80%' }}
        >
          {/* Cup Body */}
          <path d="M5 3.33V8.33C5 11.09 7.24 13.33 10 13.33C12.76 13.33 15 11.09 15 8.33V3.33H5Z" />
          {/* Left Handle */}
          <path d="M5 5H3.33C2.41 5 1.67 5.75 1.67 6.67V8.33C1.67 9.25 2.41 10 3.33 10H5" />
          {/* Right Handle */}
          <path d="M15 5H16.67C17.59 5 18.33 5.75 18.33 6.67V8.33C18.33 9.25 17.59 10 16.67 10H15" />
          {/* Stem & Base */}
          <path d="M10 13.33V16.67" />
          <path d="M5.83 16.67H14.17" />
          <path d="M3.33 18.33H16.67" />
        </motion.svg>
      </div>
    );
  }
);

TrophyIcon.displayName = 'TrophyIcon';

export { TrophyIcon };
