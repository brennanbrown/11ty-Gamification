import { describe, it, expect } from 'vitest';
// No filesystem fixtures; keep test self-contained

// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildAnalyzer = require('../../src/_data/analyzer.js');

function post(url: string, title: string, md: string) {
  return {
    url,
    data: { title },
    templateContent: md,
  };
}

describe('analyzer data builder', () => {
  it('computes per-post words and minutes and totals', () => {
    const sampleMd = `---\ntitle: Analyzer A\n---\n\n# Heading\n\nThis is a sample post with some words to analyze.`;
    const posts = [
      post('/posts/a/', 'Analyzer A', sampleMd),
      post('/posts/b/', 'Analyzer B', sampleMd), // reuse same content
    ];
    const eleventyData = { collections: { all: posts } };
    const data = buildAnalyzer(eleventyData);

    // Shape
    expect(data).toHaveProperty('perPost');
    expect(data).toHaveProperty('totals');
    expect(Object.keys(data.perPost)).toEqual(['/posts/a/', '/posts/b/']);

    // Values
    const a = data.perPost['/posts/a/'];
    const b = data.perPost['/posts/b/'];
    expect(a.words).toBeGreaterThan(0);
    expect(b.words).toBe(a.words);
    expect(a.minutes).toBeGreaterThanOrEqual(1);

    expect(data.totals.posts).toBe(2);
    expect(data.totals.words).toBe(a.words + b.words);
    expect(data.totals.minutes).toBeGreaterThanOrEqual(1);
  });
});
