import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Heatmap uses per-day word counts for shading', () => {
  it('renders white for 0-word days and darker shades for higher words; titles show "+ words"', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('index.html');

    // Legend text mentions words-based shading
    expect(html).toContain('0 words = white, more words = darker');

    // At least one day cell is white (0 words)
    expect(html).toMatch(/background:\s*#ffffff/);

    // At least one day cell uses green rgba with an opacity bucket (0.2, 0.4, 0.6, or 0.8)
    expect(html).toMatch(/background:\s*rgba\(16,185,129,0\.(2|4|6|8)\)/);

    // Day titles report words instead of counts
    expect(html).toMatch(/title="\d{4}-\d{2}-\d{2}:\s*\d+\s+words"/);
  });
});
