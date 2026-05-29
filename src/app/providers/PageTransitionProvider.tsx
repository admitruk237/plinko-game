'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { PageTransitionContext } from '@/shared/lib/page-transition-context';
import { PageTransition } from '@/shared/ui/page-transition';

const TRANSITION_DURATION = 600;

interface Props {
  children: ReactNode;
}

export const PageTransitionProvider = ({ children }: Props) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const prevPathnameRef = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    setIsTransitioning(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, TRANSITION_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  return (
    <PageTransitionContext value={{ isTransitioning }}>
      {children}
      <PageTransition isVisible={isTransitioning} />
    </PageTransitionContext>
  );
};
