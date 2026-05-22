import * as React from 'react';
import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { cn } from '@/shared/lib/utils';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  thumbClassName?: string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, thumbClassName, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      thumbAlignment="edge"
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full items-center h-6 cursor-pointer">
        <SliderPrimitive.Track className="relative h-4 w-full overflow-hidden rounded-full bg-[#262626]">
          <SliderPrimitive.Indicator className="absolute h-full rounded-full bg-[#FAFAFA]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            'absolute h-[16px] w-[16px] rounded-full border-2 border-[#FAFAFA] bg-[#0A0A0A] outline-none cursor-pointer',
            thumbClassName
          )}
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
);
Slider.displayName = 'Slider';

export { Slider };
