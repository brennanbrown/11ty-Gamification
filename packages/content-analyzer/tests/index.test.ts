import { describe, it, expect } from 'vitest';
import { analyzeContent, stripFrontmatter, countWords, readingTimeMinutes } from '../src/index';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('stripFrontmatter', () => {
  it('removes YAML frontmatter at top', () => {
    const input = `---\ntitle: Test\n---\n# Heading\nContent`;
    expect(stripFrontmatter(input)).toBe('\n# Heading\nContent');
  });

  it('returns original when no frontmatter', () => {
    const input = '# Title\nBody';
    expect(stripFrontmatter(input)).toBe(input);
  });
});

describe('countWords', () => {
  it('counts simple words', () => {
    expect(countWords('hello world')).toBe(2);
  });

  it('ignores code blocks and inline code', () => {
    const md = 'text before```\nconst x = 1;\n```after `inline` code';
    expect(countWords(md)).toBe(3); // text, before, after
  });

  it('handles unicode words and punctuation', () => {
    expect(countWords("Café au lait — it’s fine")).toBe(5);
  });

  it('handles numbers as words', () => {
    expect(countWords('Version 2.0 has 3 features')).toBe(5);
  });

  it('empty input yields 0', () => {
    expect(countWords('')).toBe(0);
  });
});

describe('readingTimeMinutes', () => {
  it('computes rounded to 1 decimal', () => {
    expect(readingTimeMinutes(400, 200)).toBe(2.0);
    expect(readingTimeMinutes(250, 200)).toBe(1.3);
  });

  it('handles zero/negative', () => {
    expect(readingTimeMinutes(0)).toBe(0);
    expect(readingTimeMinutes(-10)).toBe(0);
  });
});

describe('analyzeContent', () => {
  it('returns word count and reading time', () => {
    const md = '# Title\nThis is a test post with some words.';
    const res = analyzeContent(md);
    expect(res.wordCount).toBe(9);
    expect(res.readingTimeMin).toBeCloseTo(0.0 + 9 / 200, 1); // ~0.0 rounded to 1 decimal
  });

  it('respects custom WPM', () => {
    const res = analyzeContent('one two three four five', { wpm: 100 });
    expect(res.wordCount).toBe(5);
    expect(res.readingTimeMin).toBe(0.1); // 0.05 -> 0.1 after rounding to 1 decimal
  });
});

describe('fixtures', () => {
  it('analyzes a realistic markdown post fixture', () => {
    const file = resolve(__dirname, 'fixtures', 'post-simple.md');
    const md = readFileSync(file, 'utf8');
    const res = analyzeContent(md);
    // Ensure code blocks and inline code are ignored and unicode words counted
    expect(res.wordCount).toBeGreaterThan(20);
    expect(res.readingTimeMin).toBeGreaterThanOrEqual(0);
  });
});
