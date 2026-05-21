export function multiplierColor(m: number): string {
  if (m >= 10) return 'bg-red-500';
  if (m >= 3) return 'bg-orange-500';
  if (m >= 1) return 'bg-yellow-500';
  if (m >= 0.5) return 'bg-green-500';
  return 'bg-green-800';
}

export function multiplierTextColor(m: number): string {
  if (m >= 10) return 'text-red-500';
  if (m >= 3) return 'text-orange-500';
  if (m >= 1) return 'text-yellow-500';
  if (m >= 0.5) return 'text-green-500';
  return 'text-green-800';
}

export function multiplierBorderColor(m: number): string {
  if (m >= 10) return 'border-red-500';
  if (m >= 3) return 'border-orange-500';
  if (m >= 1) return 'border-yellow-500';
  if (m >= 0.5) return 'border-green-500';
  return 'border-green-800';
}
