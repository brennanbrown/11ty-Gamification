import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Posts index fixes', () => {
  it('does not list the posts index as a post and renders tag pills without bullets', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('posts/index.html');

    // Should not contain a post card linking to /posts/ in the listing
    // Look specifically for a card h2 link that incorrectly points to /posts/
    const badCardLink = /<li class="card">[\s\S]*?<h2[^>]*><a href="\/posts\/">/i.test(html);
    expect(badCardLink).toBe(false);

    // Tag pills should render with list-style: none on the UL
    // Look for UL with inline list-style reset introduced in tag-pills component
    const hasTagPillsListReset = /<ul[^>]*style="[^"]*list-style:\s*none/i.test(html);
    expect(hasTagPillsListReset).toBe(true);
  });
});
