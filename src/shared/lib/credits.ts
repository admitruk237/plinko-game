const DECIMALS = 6n;
const UNIT = 10n ** DECIMALS;

export const MIN_BET = 1_000_000n;
export const MAX_BET = 1_000_000_000_000n;

export function formatCredits(raw: string): string {
  const v = BigInt(raw);
  const whole = v / UNIT;
  const frac = (v % UNIT).toString().padStart(6, '0').slice(0, 2);
  return `${whole.toLocaleString()}.${frac}`;
}

export function parseCredits(input: string): bigint {
  const [w, f = ''] = input.replace(/[, ]/g, '').split('.');
  const whole = BigInt(w || '0') * UNIT;
  const frac = BigInt(`${f}000000`.slice(0, 6));
  return whole + frac;
}

export function creditsToDisplay(raw: string): string {
  return formatCredits(raw);
}

export function displayToCredits(display: string): string {
  return parseCredits(display).toString();
}
