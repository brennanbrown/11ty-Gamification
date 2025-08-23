import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Accessibility basics', () => {
  it('includes focus-ring styles and reduced motion media query, and applies focus-ring to links', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('index.html');

    // Inline style block includes focus-ring rules
    expect(html).toMatch(/\.focus-ring:focus-visible\s*\{[^}]*outline/);

    // Reduced motion media query present
    expect(html).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);

    // Heatmap day cells have focus-ring class
    expect(html).toMatch(/data-heatmap="calendar"[\s\S]*?<a[^>]*class="[^"]*focus-ring[^"]*"/);

    // "View full calendar" link has focus-ring
    expect(html).toMatch(/<a[^>]*href="\/calendar\/"[^>]*class="[^"]*focus-ring[^"]*"/);
  });
});
