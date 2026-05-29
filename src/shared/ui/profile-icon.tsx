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

export interface ProfileIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const BOB_VARIANTS: Variants = {
  normal: {
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 12 },
  },
  animate: {
    y: -1.5,
    transition: { type: 'spring', stiffness: 300, damping: 8 },
  },
};

const ProfileIcon = forwardRef<ProfileIconHandle, Props>(
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
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.67"
          viewBox="0 0 20 20"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head */}
          <motion.circle
            variants={BOB_VARIANTS}
            animate={controls}
            initial="normal"
            cx="10"
            cy="5.83"
            r="3.33"
          />
          {/* Shoulders */}
          <path d="M4.17 17.5C4.17 14.74 6.78 12.5 10 12.5C13.22 12.5 15.83 14.74 15.83 17.5" />
        </svg>
      </div>
    );
  }
);

ProfileIcon.displayName = 'ProfileIcon';

export { ProfileIcon };
