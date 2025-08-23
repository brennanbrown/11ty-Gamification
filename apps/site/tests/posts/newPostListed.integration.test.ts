import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('New dev journey post is listed', () => {
  it('renders the new post on the Posts index with correct link and title', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('posts/index.html');

    // Expect a link to the newly added post
    expect(html).toContain('/posts/dev-journey-2025-08-23/');
    expect(html).toMatch(/Dev Journey — Badges UI, Tooltips, and Test Stabilization/);
  });
});
