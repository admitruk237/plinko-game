'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { PageTransitionContext } from '@/shared/lib/page-transition-context';
import { PageTransition } from '@/shared/ui/page-transition';

const TRANSITION_DURATION = 600;

interface Props {
  children: ReactNode;
}

export const PageTransitionProvider = ({ children }: Props) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [instant, setInstant] = useState<boolean>(true);
  const prevPathnameRef = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
  }, []);

  const triggerTransition = useCallback(() => {
    setIsTransitioning(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    const id = setTimeout(() => setInstant(false), 0);
    scheduleHide();
    return () => {
      clearTimeout(id);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scheduleHide]);

  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;
    setIsTransitioning(true);
    scheduleHide();
  }, [pathname, scheduleHide]);

  return (
    <PageTransitionContext value={{ isTransitioning, triggerTransition }}>
      {children}
      <PageTransition isVisible={isTransitioning} instant={instant} />
    </PageTransitionContext>
  );
};
