import { describe, it, expect } from 'vitest';
import { computeTagPills } from '../src/pills';

describe('computeTagPills', () => {
  it('normalizes and filters reserved tags, returns bg/text colors', () => {
    const pills = computeTagPills(['JavaScript', 'posts', 'css', 'All', 'CSS']);
    // should be unique, lowercased, without reserved
    const tags = pills.map((p) => p.tag);
    expect(tags).toEqual(['javascript', 'css']);
    for (const p of pills) {
      expect(p.bg).toMatch(/^#[0-9a-f]{6}$/i);
      expect(['#111111', '#ffffff']).toContain(p.text);
    }
  });
});
