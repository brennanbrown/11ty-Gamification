import { describe, it, expect, vi } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildBadges = require('../../src/_data/badges.js');

describe('badges recent flags', () => {
  it('marks recent for streak/spirit when today has activity and value equals threshold', () => {
    // Mock Date to a fixed day
    const fixed = new Date('2025-08-23T12:00:00Z');
    vi.setSystemTime(fixed);

    const eleventyData = {
      activity: {
        streak: 5,
        byDay: {
          '2025-08-19': 1,
          '2025-08-20': 1,
          '2025-08-21': 1,
          '2025-08-22': 1,
          '2025-08-23': 1,
        },
      },
      analyzer: { totals: { words: 900 } },
    };

    const data = buildBadges(eleventyData);

    const streak5 = data.tiers.streak.find((t: any) => t.threshold === 5);
    const spirit5 = data.tiers.spirit.find((t: any) => t.threshold === 5);
    expect(streak5?.recent).toBe(true);
    expect(spirit5?.recent).toBe(true);

    // Wordcount does not set recent
    const word750 = data.tiers.wordcount.find((t: any) => t.threshold === 750);
    expect(word750?.recent).toBe(false);
  });
});
