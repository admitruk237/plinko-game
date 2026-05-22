'use client';

import { forwardRef, type HTMLAttributes, useCallback, useImperativeHandle, useRef } from 'react';
import { domMin, LazyMotion, m, useAnimation, useReducedMotion, type Variants } from 'motion/react';
import { cn } from '@/shared/lib/utils';

export interface MoveLeftIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface MoveLeftIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | 'color'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
> {
  size?: number;
  duration?: number;
  isAnimated?: boolean;
  color?: string;
}

const MoveLeftIcon = forwardRef<MoveLeftIconHandle, MoveLeftIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 1,
      isAnimated = true,
      color,
      ...props
    },
    ref
  ) => {
    const controls = useAnimation();
    const reduced = useReducedMotion();
    const isControlled = useRef(false);

    useImperativeHandle(ref, () => {
      isControlled.current = true;
      return {
        startAnimation: () => {
          if (reduced) {
            void controls.start('normal');
          } else {
            void controls.start('animate');
          }
        },
        stopAnimation: () => {
          void controls.start('normal');
        },
      };
    });

    const handleEnter = useCallback(
      (e?: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return;
        if (!isControlled.current) {
          void controls.start('animate');
        } else if (e) {
          onMouseEnter?.(e);
        }
      },
      [controls, reduced, isAnimated, onMouseEnter]
    );

    const handleLeave = useCallback(
      (e?: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) {
          void controls.start('normal');
        } else if (e) {
          onMouseLeave?.(e);
        }
      },
      [controls, onMouseLeave]
    );

    const arrowVariants: Variants = {
      normal: { x: 0 },
      animate: {
        x: [0, -3, 0],
        transition: { duration: 0.6 * duration, repeat: 0, ease: 'easeInOut' },
      },
    };

    const lineVariants: Variants = {
      normal: { strokeOpacity: 1 },
      animate: {
        strokeOpacity: [1, 0.5, 1],
        transition: { duration: 0.8 * duration, repeat: 0 },
      },
    };

    return (
      <LazyMotion features={domMin} strict>
        <m.div
          className={cn('inline-flex items-center justify-center', className)}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          {...props}
          style={{ color, ...props.style }}
        >
          <m.svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={controls}
            initial="normal"
          >
            <m.path d="M6 8L2 12L6 16" variants={arrowVariants} stroke="currentColor" />
            <m.path d="M2 12H22" variants={lineVariants} stroke="currentColor" />
          </m.svg>
        </m.div>
      </LazyMotion>
    );
  }
);

MoveLeftIcon.displayName = 'MoveLeftIcon';

export { MoveLeftIcon };
