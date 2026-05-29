const COLOR_DANGER = '#FB2C36';
const COLOR_WARNING = '#F0B100';
const COLOR_SUCCESS = '#00C950';

export const getMultiplierHex = (m: number): string => {
  if (m >= 5) return COLOR_DANGER;
  if (m >= 1) return COLOR_WARNING;
  return COLOR_SUCCESS;
};
