'use client';

import { motion, type Transition, useAnimation, type Variants } from 'motion/react';
import { forwardRef, type HTMLAttributes, useCallback, useImperativeHandle, useRef } from 'react';

import { cn } from '@/shared/lib/utils';

export interface LogoutIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const ARROW_TRANSITION: Transition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1],
};

const ARROW_VARIANTS: Variants = {
  normal: {
    x: 0,
  },
  animate: {
    x: 4,
  },
};

const LogoutIcon = forwardRef<LogoutIconHandle, Props>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
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
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start('animate');
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
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
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <motion.polyline
            animate={controls}
            initial="normal"
            points="16,17 21,12 16,7"
            transition={ARROW_TRANSITION}
            variants={ARROW_VARIANTS}
          />
          <motion.line
            animate={controls}
            initial="normal"
            transition={ARROW_TRANSITION}
            variants={ARROW_VARIANTS}
            x1="21"
            x2="9"
            y1="12"
            y2="12"
          />
        </svg>
      </div>
    );
  }
);

LogoutIcon.displayName = 'LogoutIcon';

export { LogoutIcon };
