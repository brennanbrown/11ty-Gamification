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

describe('Calendar month navigation', () => {
  it('calendar index and current month exist with prev/next links', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    expect(exists('calendar/index.html')).toBe(true);

    // Current month inferred from posts (latest post month)
    const monthHtml = read('calendar/2025-08/index.html');
    expect(monthHtml).toContain('>Sun<');
    expect(monthHtml).toContain('>Mon<');
    // Prev/Next navigation
    expect(monthHtml).toMatch(/href="\/calendar\/2025-07\//);
    expect(monthHtml).toMatch(/href="\/calendar\/2025-09\//);
    // Day link
    expect(monthHtml).toMatch(/href="\/days\/2025-08-01\//);
  });
});
