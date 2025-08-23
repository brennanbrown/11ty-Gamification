import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildAnalyzer = require('../../src/_data/analyzer.js');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('analyzer reads from inputPath when templateContent is missing', () => {
  it('uses fs to read markdown and computes stats', () => {
    const md = `---\ntitle: Test\n---\nHello world!\n`;
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(md);

    const posts = [
      { url: '/posts/test/', inputPath: '/fake/test.md', templateContent: '', data: { title: 'Test' } },
    ];

    const data = buildAnalyzer({ collections: { all: posts } });
    expect(data.totals.posts).toBe(1);
    // words should be > 0 if file was read
    expect(data.totals.words).toBeGreaterThan(0);
    expect(data.perPost['/posts/test/'].words).toBeGreaterThan(0);
  });
});
