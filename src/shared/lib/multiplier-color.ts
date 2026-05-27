// Exactly the 3 risk-button colors: HIGH=red, MEDIUM=yellow, LOW=green
export function getMultiplierHex(m: number): string {
  if (m >= 5) return '#FB2C36'; // big win  → HIGH (red)
  if (m >= 1) return '#F0B100'; // small win → MEDIUM (yellow)
  return '#00C950'; // loss      → LOW (green)
}

// Legacy text-color classes
export function multiplierTextColor(m: number): string {
  if (m >= 5) return 'text-danger';
  if (m >= 1) return 'text-warning';
  return 'text-success';
}

// Legacy exports
export { getMultiplierHex as multiplierColor };
export { getMultiplierHex as multiplierBorderColor };
export { getMultiplierHex as multiplierBg };
export { getMultiplierHex as multiplierBorder };
export { getMultiplierHex as multiplierText };
