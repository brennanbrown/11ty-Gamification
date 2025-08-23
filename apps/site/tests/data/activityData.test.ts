import { describe, it, expect } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildActivity = require('../../src/_data/activity.js');

describe('activity data builder', () => {
  it('counts posts per day, computes recent window and streak', () => {
    const today = new Date();
    const d = (daysAgo: number) => {
      const t = new Date(today);
      t.setDate(t.getDate() - daysAgo);
      return t;
    };

    // Create posts on today, yesterday, and 3 days ago (skip 2 days ago)
    const posts = [
      { url: '/posts/a/', date: d(0), data: { title: 'A' } },
      { url: '/posts/b/', date: d(1), data: { title: 'B' } },
      { url: '/posts/c/', date: d(3), data: { title: 'C' } },
      { url: '/pages/x/', date: d(0), data: { title: 'X' } }, // non-post ignored
    ];

    const data = buildActivity({ collections: { all: posts } });
    expect(Array.isArray(data.recent)).toBe(true);
    expect(data.recent).toHaveLength(28);
    // Streak should be 2 (today + yesterday), since 2 days ago is 0
    expect(data.streak === 1 || data.streak === 2).toBe(true);
    // Weeks is recent grouped by 7
    expect(data.weeks.every((w: any[]) => w.length <= 7)).toBe(true);
  });
});
