import { describe, it, expect } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildBadges = require('../../src/_data/badges.js');

describe('badges data builder (Phase 1)', () => {
  it('computes streak/spirit/wordcount earned and next thresholds', () => {
    const eleventyData = {
      activity: {
        streak: 3,
        byDay: {
          '2025-08-18': 1,
          '2025-08-19': 2,
          '2025-08-21': 1,
        },
      },
      analyzer: {
        totals: { words: 800 },
      },
    };

    const data = buildBadges(eleventyData);

    expect(data.streak).toBe(3);
    expect(data.totalActiveDays).toBe(3);
    expect(data.words).toBe(800);

    // Earned
    expect(data.earned.streak.map((b: any) => b.threshold)).toContain(3);
    expect(data.earned.spirit.map((b: any) => b.threshold)).toContain(3);
    expect(data.earned.wordcount.map((b: any) => b.threshold)).toContain(750);

    // Next thresholds
    expect(data.next.streak).toBe(5);
    expect(data.next.spirit).toBe(5);
    expect(data.next.wordcount).toBe(5000);
  });
});
