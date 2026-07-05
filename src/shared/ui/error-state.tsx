'use client';

import { cn } from '@/shared/lib/utils';
import { Button } from './button';
import type { HTMLAttributes } from 'react';

const DEFAULT_ERROR_TITLE = 'Something went wrong';
const DEFAULT_RETRY_LABEL = 'Try Again';

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  fullScreen?: boolean;
}

export const ErrorState = ({
  title = DEFAULT_ERROR_TITLE,
  message,
  onRetry,
  retryLabel = DEFAULT_RETRY_LABEL,
  fullScreen = true,
  className,
  ...props
}: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 text-center',
        fullScreen ? 'min-h-screen' : 'w-full h-full py-20',
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center max-w-sm gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 text-destructive">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {message && <p className="text-sm text-white/50">{message}</p>}
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="mt-2 border-white/10 hover:bg-white/5 text-white"
          >
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
