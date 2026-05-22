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
        // Risk variants mapped to the Plinko theme specs
        low: 'bg-[#00C95033] text-[#00C950]',
        medium: 'bg-[#F0B10033] text-[#F0B100]',
        high: 'bg-[#FB2C3633] text-[#FB2C36]',
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
