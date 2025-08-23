import { describe, it, expect } from 'vitest';
import { tagColor, tagTextColor, tagColorHsl, hslToRgb, rgbToHex } from '../src/tagColors';

describe('tagColors', () => {
  it('is deterministic for the same tag', () => {
    const a = tagColor('javascript');
    const b = tagColor('javascript');
    expect(a).toBe(b);
  });

  it('produces distinct colors for common tags', () => {
    const tags = ['javascript', 'typescript', 'css', 'html', 'eleventy', 'tailwind'];
    const colors = tags.map(tagColor);
    const uniq = new Set(colors);
    expect(uniq.size).toBeGreaterThanOrEqual(5);
  });

  it('provides readable text color against background', () => {
    const bg = tagColor('accessibility');
    const text = tagTextColor(bg);
    expect(['#111111', '#ffffff']).toContain(text);
  });

  it('converts HSL to hex consistently', () => {
    const hsl = tagColorHsl('markdown');
    const { r, g, b } = hslToRgb(hsl);
    const hex = rgbToHex(r, g, b);
    expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
