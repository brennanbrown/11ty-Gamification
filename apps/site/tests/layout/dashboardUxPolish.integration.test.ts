import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Dashboard UX polish', () => {
  it('renders header Badges link, dashboard Badges heading link, and heatmap CSS var', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('index.html');

    // Header navigation contains Badges link
    expect(html).toContain('<a href="/badges/">Badges</a>');

    // Badges section heading is a link to /badges/
    expect(html).toMatch(/<h2[^>]*>\s*<a href="\/badges\/"[^>]*>Badges<\/a>\s*<\/h2>/);

    // Heatmap grid uses CSS variable for cell size
    expect(html).toMatch(/grid-template-columns: repeat\(7, var\(--cell-size\)\)/);
    // Heatmap day anchor uses CSS variable for width/height
    expect(html).toMatch(/style="[^"]*width:var\(--cell-size\); height:var\(--cell-size\);/);
  });
});
