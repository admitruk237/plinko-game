import { formatMemberSince, levelProgress, missionPercent } from '@/shared/lib/progression';

describe('levelProgress', () => {
  it('derives percent and xp-to-next within the current level', () => {
    const result = levelProgress({
      level: 1,
      xp: 50,
      xpForCurrentLevel: 0,
      xpForNextLevel: 250,
      xpIntoCurrentLevel: 50,
    });
    expect(result.percent).toBe(20);
    expect(result.xpToNext).toBe(200);
  });

  it('clamps percent to 100 and never returns NaN when span is zero', () => {
    const result = levelProgress({
      level: 9,
      xp: 9000,
      xpForCurrentLevel: 9000,
      xpForNextLevel: 9000,
      xpIntoCurrentLevel: 0,
    });
    expect(result.percent).toBe(0);
    expect(result.xpToNext).toBe(0);
  });
});

describe('missionPercent', () => {
  it('returns floored percent of progress over target', () => {
    expect(missionPercent(0, 5)).toBe(0);
    expect(missionPercent(1, 3)).toBe(33);
    expect(missionPercent(5, 5)).toBe(100);
  });

  it('clamps over-completion and guards zero target', () => {
    expect(missionPercent(7, 5)).toBe(100);
    expect(missionPercent(1, 0)).toBe(0);
  });
});

describe('formatMemberSince', () => {
  it('formats an ISO date to "Month YYYY"', () => {
    expect(formatMemberSince('2026-05-10T12:00:00.000Z')).toBe('May 2026');
  });

  it('returns a dash for invalid input', () => {
    expect(formatMemberSince('not-a-date')).toBe('-');
  });
});
