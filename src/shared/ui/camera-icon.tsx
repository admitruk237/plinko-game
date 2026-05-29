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

export interface CameraIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CAMERA_VARIANTS: Variants = {
  normal: {
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 15 },
  },
  animate: {
    scale: [1, 0.9, 1.1, 1],
    rotate: [0, -8, 8, 0],
    transition: { duration: 0.45, ease: 'easeInOut' },
  },
};

const SHUTTER_VARIANTS: Variants = {
  normal: {
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 15 },
  },
  animate: {
    scale: [1, 0.7, 1.25, 1],
    transition: { duration: 0.4, ease: 'easeInOut', delay: 0.05 },
  },
};

const FLASH_VARIANTS: Variants = {
  normal: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: [0, 1, 0],
    scale: [0.5, 1.5, 1],
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export const CameraIcon = forwardRef<CameraIconHandle, Props>(
  ({ onMouseEnter, onMouseLeave, className, size = 24, ...props }, ref) => {
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
        className={cn('inline-flex items-center justify-center', className)}
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
          <g style={{ transformOrigin: 'center' }}>
            <motion.path
              variants={CAMERA_VARIANTS}
              animate={controls}
              initial="normal"
              d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
              style={{ transformOrigin: 'center' }}
            />
            <motion.circle
              variants={SHUTTER_VARIANTS}
              animate={controls}
              initial="normal"
              cx="12"
              cy="13"
              r="3"
              style={{ transformOrigin: '12px 13px' }}
            />
            <motion.circle
              variants={FLASH_VARIANTS}
              animate={controls}
              initial="normal"
              cx="19"
              cy="10"
              r="1"
              fill="currentColor"
              style={{ transformOrigin: '19px 10px' }}
            />
          </g>
        </svg>
      </div>
    );
  }
);

CameraIcon.displayName = 'CameraIcon';
