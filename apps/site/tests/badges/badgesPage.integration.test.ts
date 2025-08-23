import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Badges info page', () => {
  it('renders badges page with sections and tiers', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('badges/index.html');

    expect(html).toContain('<h1');
    expect(html).toContain('Streak');
    expect(html).toContain('Word Count');
    expect(html).toContain('Behavior');
    // Should list at least a couple of emoji from tiers
    expect(html).toMatch(/[\u{1F33F}\u{1F33C}\u{2B50}\u{2728}]/u); // sample: 🌿🌼⭐✨
  });
});
