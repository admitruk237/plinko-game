export const getMultiplierHex = (m: number): string => {
  if (m >= 5) return 'var(--color-danger)';
  if (m >= 1) return 'var(--color-warning)';
  return 'var(--color-success)';
};
