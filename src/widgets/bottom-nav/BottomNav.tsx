'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/shared/lib/utils';
import { useBottomNav } from './model/useBottomNav';

const BottomNavInner = () => {
  const { navItems } = useBottomNav();

  return (
    <footer className="w-full h-[65px] bg-panel/95 border-t border-panel-border backdrop-blur-sm z-50 shrink-0">
      <div className="max-w-[896px] h-full mx-auto flex items-center justify-around relative">
        {navItems.map((item) => (
          <Link
            key={item.route}
            href={item.route}
            onClick={item.onClick}
            className="flex flex-col items-center justify-center w-[224px] h-[64px] relative cursor-pointer"
            onMouseEnter={item.onHoverStart}
            onMouseLeave={item.onHoverEnd}
          >
            {item.isActive && (
              <motion.div
                layoutId="bottom-nav-active-bar"
                className="absolute top-0 w-12 h-1 bg-gradient-to-r from-success to-teal-500 rounded-b-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}

            <div className="flex items-center justify-center h-6 mb-1">{item.icon}</div>

            <span
              className={cn(
                'font-sans font-medium text-xs leading-4 text-center transition-colors duration-200',
                item.isActive ? 'text-success' : 'text-text-muted'
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </footer>
  );
};

export const BottomNav = memo(BottomNavInner);
