import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';

import { cn } from '@/shared/lib/utils';

const Input = ({ className, type, ...props }: React.ComponentProps<'input'>) => {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        'h-9 w-full min-w-0 rounded-[8px] border border-auth-border border-t-auth-border-top bg-auth-input-bg/30 px-3 py-1 text-base text-white placeholder:text-auth-input-placeholder transition-colors outline-none focus-visible:border-blue-500 focus-visible:border-t-blue-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive md:text-sm',
        className
      )}
      {...props}
    />
  );
};

export { Input };
