import { createContext, useContext } from 'react';

export interface PageTransitionContextValue {
  isTransitioning: boolean;
}

export const PageTransitionContext = createContext<PageTransitionContextValue>({
  isTransitioning: false,
});

export const usePageTransition = () => useContext(PageTransitionContext);
