import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function exists(rel: string) {
  return fs.existsSync(path.join(outDir, rel));
}

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Site build integration', () => {
  it('builds pages and expected outputs exist with layout chrome', () => {
    // Build only the site app via Eleventy (no CSS required for HTML assertions)
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });

    // Core pages
    expect(exists('index.html')).toBe(true);
    expect(exists('posts/index.html')).toBe(true);
    expect(exists('search/index.html')).toBe(true);
    expect(exists('tags/index.html')).toBe(true);

    // Known post pages
    expect(exists('posts/markdown-guide/index.html')).toBe(true);
    expect(exists('posts/development-notes/index.html')).toBe(true);
    expect(exists('posts/scale-testing-badge-engine/index.html')).toBe(true);
    expect(exists('posts/badge-engine-overview/index.html')).toBe(true);
    expect(exists('posts/writing-workflow/index.html')).toBe(true);
    expect(exists('posts/tagging-strategy/index.html')).toBe(true);

    // Known tag pages from frontmatter tags
    expect(exists('tags/markdown/index.html')).toBe(true);
    expect(exists('tags/development/index.html')).toBe(true);
    expect(exists('tags/testing/index.html')).toBe(true);
    // New tags from evergreen posts
    expect(exists('tags/badges/index.html')).toBe(true);
    expect(exists('tags/architecture/index.html')).toBe(true);
    expect(exists('tags/process/index.html')).toBe(true);
    expect(exists('tags/writing/index.html')).toBe(true);
    expect(exists('tags/tags/index.html')).toBe(true);
    expect(exists('tags/organization/index.html')).toBe(true);

    // Layout chrome checks: header/nav and favicon present on main pages
    const home = read('index.html');
    const tags = read('tags/index.html');
    const post = read('posts/markdown-guide/index.html');

    for (const html of [home, tags, post]) {
      expect(html).toContain('class="gradient-text"'); // brand link from layout
      expect(html).toContain('<a href="/search/">Search</a>'); // nav link
      expect(html).toContain("rel=\"icon\""); // inline favicon
    }
  });

  it('dashboard shows non-zero analyzer totals and per-post stats', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const home = read('index.html');
    // Extract numbers from the three stat cards by label
    const getCardValue = (label: string) => {
      const re = new RegExp(`${label}[^]*?font-semibold">(\\d+)<`, 'i');
      const m = home.match(re);
      return m ? Number(m[1]) : 0;
    };
    const postsCount = getCardValue('Posts');
    const wordsCount = getCardValue('Words');
    const minutesCount = getCardValue('Reading Minutes');

    expect(postsCount).toBeGreaterThan(0);
    expect(wordsCount).toBeGreaterThan(0);
    expect(minutesCount).toBeGreaterThan(0);

    // Per-post table should contain numeric words/minutes for a known post
    const rowRe = new RegExp('/posts/markdown-guide/[^]*?<td class="py-2 px-3">(\\d+)<\\/td>[^]*?<td class="py-2 px-3">(\\d+)<\\/td>', 'i');
    const rowMatch = home.match(rowRe);
    expect(rowMatch).toBeTruthy();
    if (rowMatch) {
      expect(Number(rowMatch[1])).toBeGreaterThan(0);
      expect(Number(rowMatch[2])).toBeGreaterThan(0);
    }

    // Search page exists (content is client-driven)
    expect(exists('search/index.html')).toBe(true);
  });
});
