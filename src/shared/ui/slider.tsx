import * as React from 'react';
import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { cn } from '@/shared/lib/utils';

const Slider = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Control className="relative flex w-full items-center h-4 cursor-pointer">
      <SliderPrimitive.Track className="relative h-4 w-full rounded-full bg-[#262626]">
        <SliderPrimitive.Indicator className="absolute h-full rounded-full bg-[#FAFAFA]" />
        <SliderPrimitive.Thumb className="absolute top-1/2 -translate-y-1/2 -ml-[7px] h-[14px] w-[14px] p-0 m-0 box-border rounded-full border border-[#FAFAFA] bg-[#0A0A0A] outline-none transition-transform focus:outline-none cursor-pointer" />
      </SliderPrimitive.Track>
    </SliderPrimitive.Control>
  </SliderPrimitive.Root>
));
Slider.displayName = 'Slider';

export { Slider };
