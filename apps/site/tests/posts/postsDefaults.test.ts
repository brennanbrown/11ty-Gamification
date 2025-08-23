import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

function exists(rel: string) {
  return fs.existsSync(path.join(outDir, rel));
}

describe('Posts default layout via directory data (posts.json)', () => {
  it('applies post.njk layout to posts without explicit layout in front matter', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });

    // hello-world was rewritten and no longer includes an explicit layout
    const postPath = 'posts/hello-world/index.html';
    expect(exists(postPath)).toBe(true);
    const html = read(postPath);

    // Layout chrome from layout.njk should be present (top nav)
    expect(html).toContain('<nav class="navlinks" aria-label="Primary">');
    expect(html).toContain('<a href="/search/">Search</a>');

    // Title rendered by post.njk
    expect(html).toContain('<h1>Why I Built IndieGarden</h1>');
  });
});
