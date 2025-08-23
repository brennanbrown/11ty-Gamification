import { describe, it, expect } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildBadges = require('../../src/_data/badges.js');

describe('badges tiers exposure', () => {
  it('exposes extended streak and wordcount tiers with earned flags', () => {
    const eleventyData = {
      activity: {
        streak: 12,
        byDay: {
          '2025-08-18': 1,
          '2025-08-19': 2,
          '2025-08-20': 1,
          '2025-08-21': 1,
          '2025-08-22': 1,
        },
      },
      analyzer: {
        totals: { words: 120000 },
      },
    };

    const data = buildBadges(eleventyData);

    // Streak tiers contain extended thresholds
    const streakThresholds = data.tiers.streak.map((t: any) => t.threshold);
    expect(streakThresholds).toEqual([3, 5, 10, 30, 100, 200, 365]);

    // Word tiers contain extended milestones
    const wordThresholds = data.tiers.wordcount.map((t: any) => t.threshold);
    expect(wordThresholds).toEqual([750, 5000, 10000, 50000, 100000, 250000, 500000, 750000, 1000000]);

    // Earned flags reflect inputs
    expect(data.tiers.streak.find((t: any) => t.threshold === 10).earned).toBe(true);
    expect(data.tiers.streak.find((t: any) => t.threshold === 30).earned).toBe(false);

    expect(data.tiers.wordcount.find((t: any) => t.threshold === 100000).earned).toBe(true);
    expect(data.tiers.wordcount.find((t: any) => t.threshold === 250000).earned).toBe(false);

    // Next thresholds track the first unmet
    expect(data.next.streak).toBe(30);
    expect(data.next.wordcount).toBe(250000);
  });
});
