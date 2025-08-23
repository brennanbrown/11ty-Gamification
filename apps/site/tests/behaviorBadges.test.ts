import { describe, it, expect, vi } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildBadges = require('../src/_data/badges.js');

describe('behavior badges (Early Bird, Night Owl)', () => {
  it('sets Early Bird when a post is before 09:00 UTC today', () => {
    vi.setSystemTime(new Date('2025-08-23T10:00:00Z'));
    const data = buildBadges({
      activity: {
        byDay: { '2025-08-23': 1 },
        postsByDay: {
          '2025-08-23': [ { url: '/posts/dummy/', title: 't', hour: 7 } ],
        },
      },
      analyzer: { totals: { words: 0 } },
    });
    const eb = data.behavior.find((b: any) => b.key === 'early-bird');
    const no = data.behavior.find((b: any) => b.key === 'night-owl');
    expect(eb?.earned).toBe(true);
    expect(no?.earned).toBe(false);
  });

  it('sets Night Owl when a post is at or after 22:00 UTC today', () => {
    vi.setSystemTime(new Date('2025-08-23T23:30:00Z'));
    const data = buildBadges({
      activity: {
        byDay: { '2025-08-23': 1 },
        postsByDay: {
          '2025-08-23': [ { url: '/posts/dummy/', title: 't', hour: 23 } ],
        },
      },
      analyzer: { totals: { words: 0 } },
    });
    const eb = data.behavior.find((b: any) => b.key === 'early-bird');
    const no = data.behavior.find((b: any) => b.key === 'night-owl');
    expect(eb?.earned).toBe(false);
    expect(no?.earned).toBe(true);
  });

  it('none when no posts today', () => {
    vi.setSystemTime(new Date('2025-08-24T12:00:00Z'));
    const data = buildBadges({
      activity: { byDay: {}, postsByDay: {} },
      analyzer: { totals: { words: 0 } },
    });
    const eb = data.behavior.find((b: any) => b.key === 'early-bird');
    const no = data.behavior.find((b: any) => b.key === 'night-owl');
    expect(eb?.earned).toBe(false);
    expect(no?.earned).toBe(false);
  });
});
