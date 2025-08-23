import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Badge Ideas grid renders on dashboard', () => {
  it('renders ideas with dynamic locked/unlocked titles', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('index.html');

    expect(html).toContain('data-section="badge-ideas"');
    expect(html).toContain('data-badge-idea="first-post"');
    expect(html).toContain('data-badge-idea="five-posts"');
    expect(html).toContain('data-badge-idea="1k-words"');
    expect(html).toContain('data-badge-idea="7-day-streak"');
    expect(html).toContain('data-badge-idea="weekend-writer"');

    // Ensure hover titles appear with Locked/Unlocked prefix and label
    expect(html).toMatch(/data-badge-idea=\"first-post\"[^>]*title=\"(Locked|Unlocked):\sFirst Post/);
  });
});
