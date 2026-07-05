import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-[4px] text-[12px] font-normal leading-[16px] tracking-normal font-sans uppercase w-[64.9px] h-[20px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'text-foreground border border-input',
        low: 'bg-success/20 text-success',
        medium: 'bg-warning/20 text-warning',
        high: 'bg-danger/20 text-danger',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface Props extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: Props) => {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
};
