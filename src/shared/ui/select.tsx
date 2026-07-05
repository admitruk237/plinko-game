import * as React from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectPortal = SelectPrimitive.Portal;
const SelectPositioner = SelectPrimitive.Positioner;

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-9 w-full min-w-[100px] items-center justify-between gap-2 rounded-[8px] border border-balance-border bg-panel-darker/60 px-3 py-1.5 text-sm text-white outline-none focus:ring-1 focus:ring-balance-value disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

const SelectIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Icon>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Icon
    ref={ref}
    className={cn('inline-flex items-center justify-center shrink-0', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4 opacity-50" />
  </SelectPrimitive.Icon>
));
SelectIcon.displayName = 'SelectIcon';

const SelectPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Popup>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Popup
    ref={ref}
    className={cn(
      'z-50 min-w-[100px] overflow-hidden rounded-[10px] border border-balance-border bg-panel p-1 text-white shadow-2xl outline-none transition-all duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  >
    {children}
  </SelectPrimitive.Popup>
));
SelectPopup.displayName = 'SelectPopup';

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center justify-between gap-4 rounded-[6px] py-1.5 px-3 text-sm text-text-muted outline-none data-[highlighted]:bg-panel-border/60 data-[highlighted]:text-white data-[checked]:text-white disabled:pointer-events-none disabled:opacity-50 transition-colors',
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="flex items-center justify-center text-success shrink-0">
      <Check className="h-3.5 w-3.5" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';

export {
  Select,
  SelectValue,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectIcon,
  SelectPopup,
  SelectItem,
};
