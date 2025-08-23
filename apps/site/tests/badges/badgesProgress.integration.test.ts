import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Badges progress indicators', () => {
  it('renders streak, spirit, and wordcount progress bars with sane widths', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('index.html');

    // Presence of the three progress containers
    expect(html).toContain('data-prog="streak"');
    expect(html).toContain('data-prog="spirit"');
    expect(html).toContain('data-prog="wordcount"');

    // Basic width sanity: style="width: NN%" appears for each
    const widthMatches = html.match(/style="width:\s*\d+%/g) || [];
    expect(widthMatches.length).toBeGreaterThanOrEqual(3);

    // Streak progress should be between 0% and 100%
    const streakBlock = html.split('data-prog="streak"')[1] || '';
    const streakWidth = (streakBlock.match(/width:\s*(\d+)%/) || [])[1];
    if (streakWidth) {
      const v = parseInt(streakWidth, 10);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });
});
