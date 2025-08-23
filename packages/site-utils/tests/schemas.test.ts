import { describe, it, expect } from 'vitest';
import { validateFrontmatter, validateActivity, validateAnalyzer } from '../src/schemas';

describe('schemas validators', () => {
  it('validates frontmatter happy path', () => {
    const fm = {
      title: 'Post',
      date: '2025-08-20',
      tags: ['a', 'b', 'a'],
      categories: ['c1'],
      draft: false,
    };
    const res = validateFrontmatter(fm);
    expect(res.ok).toBe(true);
    expect(res.errors).toEqual([]);
    expect(res.value?.tags).toEqual(['a', 'b']);
  });

  it('rejects invalid frontmatter types', () => {
    const res = validateFrontmatter({ title: 123, date: 7, tags: [1], draft: 'no' });
    expect(res.ok).toBe(false);
    expect(res.errors).toContain('title must be a string');
    expect(res.errors).toContain('date must be an ISO string or Date');
    expect(res.errors).toContain('tags must be an array of strings');
    expect(res.errors).toContain('draft must be a boolean');
  });

  it('validates activity structure', () => {
    const res = validateActivity({
      streak: 5,
      byDay: { '2025-08-19': 1, '2025-08-20': 0 },
      postsByDay: {
        '2025-08-19': [{ url: '/p', title: 'P', hour: 7 }],
      },
    });
    expect(res.ok).toBe(true);
    expect(res.errors).toEqual([]);
    expect(res.value?.streak).toBe(5);
  });

  it('rejects invalid activity fields', () => {
    const res = validateActivity({
      streak: -1,
      byDay: { '2025-08-XX': -2 },
      postsByDay: {
        '2025-08-19': [{ url: 1, title: 2, hour: 99 }],
      },
    });
    expect(res.ok).toBe(false);
    expect(res.errors.some((e) => e.includes('streak must be a non-negative number'))).toBe(true);
    expect(res.errors.some((e) => e.includes("byDay key '2025-08-XX'"))).toBe(true);
    expect(res.errors.some((e) => e.includes("byDay['2025-08-XX'] must be non-negative number"))).toBe(true);
    expect(res.errors.some((e) => e.includes("postsByDay['2025-08-19'] item.url must be string"))).toBe(true);
    expect(res.errors.some((e) => e.includes('item.hour must be 0-23'))).toBe(true);
  });

  it('validates analyzer totals', () => {
    const res = validateAnalyzer({ totals: { words: 1234 } });
    expect(res.ok).toBe(true);
    expect(res.value?.totals?.words).toBe(1234);
  });

  it('rejects invalid analyzer totals', () => {
    const res = validateAnalyzer({ totals: { words: -1 } });
    expect(res.ok).toBe(false);
    expect(res.errors).toContain('totals.words must be a non-negative number');
  });
});
