import { ROUTES } from '@/shared/config';

export const ICON_SIZE_DEFAULT = 20;
export const ICON_SIZE_GAME = 22;

export interface NavItemConfig {
  route: string;
  label: string;
  iconType: 'game' | 'progress' | 'history' | 'profile';
}

export const NAV_ITEMS_CONFIG: readonly NavItemConfig[] = [
  {
    route: ROUTES.GAME,
    label: 'Game',
    iconType: 'game',
  },
  {
    route: ROUTES.PROGRESS,
    label: 'Progress',
    iconType: 'progress',
  },
  {
    route: ROUTES.HISTORY,
    label: 'History',
    iconType: 'history',
  },
  {
    route: ROUTES.PROFILE,
    label: 'Profile',
    iconType: 'profile',
  },
] as const;
