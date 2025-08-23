import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

function currentMonthKeyUTC() {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

describe('Calendar month pages', () => {
  it('generates at least the current month page and links to it from index', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });

    const idx = read('calendar/index.html');
    const key = currentMonthKeyUTC();

    // index should link to current month
    expect(idx).toContain(`/calendar/${key}/`);

    // month page should exist
    const monthPath = path.join(outDir, 'calendar', key, 'index.html');
    expect(fs.existsSync(monthPath)).toBe(true);

    const html = fs.readFileSync(monthPath, 'utf8');
    expect(html).toMatch(/All months/);
  });
});
