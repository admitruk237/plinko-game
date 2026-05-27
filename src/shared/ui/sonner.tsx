'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex items-center gap-3 w-[356px] h-[54px] px-[14px] rounded-[8px] bg-panel border border-panel-border shadow-[0_4px_12px_rgba(0,0,0,0.1)] text-[13px] font-medium leading-5 tracking-[-0.076px] text-white',
          icon: 'shrink-0 text-white [&>svg]:text-white',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
