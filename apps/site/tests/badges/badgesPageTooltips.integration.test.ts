import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Badges page tooltips', () => {
  it('includes CSS tooltip markup and data attributes on badges', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('badges/index.html');

    // CSS tooltip wrapper exists
    expect(html).toMatch(/class="badge-tip"/);
    expect(html).toMatch(/class="badge-tipbox"/);

    // Data attributes present on at least one badge in each section
    expect(html).toMatch(/data-badge-name="[^"]+"/);
    expect(html).toMatch(/data-badge-desc="[^"]+"/);

    // Spirit badges retain the spirit class for grayscale styling
    expect(html).toMatch(/class="badge spirit"/);
  });
});
