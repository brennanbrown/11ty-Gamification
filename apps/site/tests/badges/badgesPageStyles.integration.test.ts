import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Badges page styles', () => {
  it('renders large badges and grayscale class for spirit', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('badges/index.html');

    // Page wrapper class applied
    expect(html).toContain('<div class="badge-page">');
    // Style block contains the large font-size rule
    expect(html).toMatch(/\.badge-page \.badge\s*\{[^}]*font-size:\s*3\.8rem;?/);
    // Spirit badges rendered with grayscale class
    expect(html).toMatch(/<span class="badge spirit"/);
    // Behavior badges present and large
    expect(html).toMatch(/<span class="badge behavior"/);
  });
});
