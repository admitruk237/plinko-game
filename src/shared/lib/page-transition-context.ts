import { createContext, useContext } from 'react';

export interface PageTransitionContextValue {
  isTransitioning: boolean;
  triggerTransition: () => void;
}

export const PageTransitionContext = createContext<PageTransitionContextValue>({
  isTransitioning: false,
  triggerTransition: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);
