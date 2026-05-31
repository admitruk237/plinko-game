const DECIMALS = 6n;
const UNIT = 10n ** DECIMALS;

export const MIN_BET = 1_000_000n;
export const MAX_BET = 10_000_000_000n;

export const formatCredits = (raw: string): string => {
  const v = BigInt(raw);
  const isNegative = v < 0n;
  const absV = isNegative ? -v : v;
  const whole = absV / UNIT;
  const frac = (absV % UNIT).toString().padStart(6, '0').slice(0, 2);
  return `${isNegative ? '-' : ''}${whole.toLocaleString()}.${frac}`;
};

export const parseCredits = (input: string): bigint => {
  const [w, f = ''] = input.replace(/[, ]/g, '').split('.');
  const whole = BigInt(w || '0') * UNIT;
  const frac = BigInt(`${f}000000`.slice(0, 6));
  return whole + frac;
};

export const sanitizeDecimalInput = (raw: string): string => {
  const clean = raw.replace(/[^0-9.]/g, '');
  const dots = clean.split('.');
  return dots.length > 2 ? `${dots[0]}.${dots.slice(1).join('')}` : clean;
};
