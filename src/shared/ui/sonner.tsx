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
            'flex items-center gap-3 w-[300px] rounded-lg px-4 py-3 text-sm font-medium shadow-xl border backdrop-blur-sm',
          success: 'bg-[#0f1a14] border-green-500/30 text-green-400 [&>[data-icon]]:text-green-400',
          error: 'bg-[#1a0f0f] border-red-500/30 text-red-400 [&>[data-icon]]:text-red-400',
          title: 'font-semibold text-[13px] leading-none',
          icon: 'shrink-0',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
