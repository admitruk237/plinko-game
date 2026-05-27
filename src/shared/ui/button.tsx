import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none cursor-pointer select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        primary:
          'w-full !h-[44px] rounded-[8px] bg-gradient-to-r from-brand-green-start to-brand-green-end text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'w-full !h-[44px] rounded-[8px] bg-gradient-to-r from-danger to-danger-hover text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50',
        link: 'text-primary underline-offset-4 hover:underline',
        quickBet:
          'h-8 px-3 gap-1.5 rounded-[8px] border border-neutral-800/50 border-t-neutral-800 bg-neutral-800/30 text-[14px] font-medium leading-[20px] tracking-[-0.15px] text-neutral-300 text-center hover:text-white hover:bg-neutral-800/40 transition-colors',
        riskOption:
          'h-10 rounded-[10px] border-2 border-neutral-700 border-t-panel-border bg-panel-dark text-[14px] font-medium leading-[20px] tracking-[-0.15px] text-text-muted text-center transition-colors data-[active=false]:hover:text-white data-[active=false]:hover:border-white/20 focus-visible:ring-0 data-[active=false]:focus-visible:border-neutral-700 data-[active=false]:focus-visible:border-t-panel-border',
        icon: 'text-white/40 hover:text-white/70 bg-transparent hover:bg-transparent transition-colors',
        headerAction:
          'h-[46px] px-4 gap-1.5 rounded-[10px] border border-balance-border bg-balance-bg text-sm font-medium text-white/80 hover:text-white hover:bg-balance-border/50 transition-colors',
      },
      size: {
        none: '',
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = ({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) => {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export { Button, buttonVariants };
