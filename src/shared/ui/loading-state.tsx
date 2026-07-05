'use client';

import { cn } from '@/shared/lib/utils';
import type { HTMLAttributes } from 'react';

const DEFAULT_LOADING_MESSAGE = 'Loading...';

interface Props extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState = ({
  message = DEFAULT_LOADING_MESSAGE,
  fullScreen = true,
  className,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullScreen ? 'min-h-screen' : 'w-full h-full py-20',
        className
      )}
      {...props}
    >
      <div className={cn('flex items-center text-white/50', message ? 'gap-3' : '')}>
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {message && <span>{message}</span>}
      </div>
    </div>
  );
};
