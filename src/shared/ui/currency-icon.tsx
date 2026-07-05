import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export const CurrencyIcon = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-[14px] h-[14px] rounded-full bg-gradient-to-b from-green-500 to-green-600 border-[0.75px] border-green-500 shrink-0 select-none',
        className
      )}
      {...props}
    >
      <svg
        width="8"
        height="8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        className="stroke-white"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </span>
  );
};
