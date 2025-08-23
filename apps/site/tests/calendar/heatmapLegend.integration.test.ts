import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Heatmap legend and thresholds', () => {
  it('renders responsive legend with refined bucket labels', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('index.html');

    expect(html).toContain('data-heatmap-legend');
    // Bucket labels
    expect(html).toContain('1–99');
    expect(html).toContain('100–249');
    expect(html).toContain('250–499');
    expect(html).toContain('500–999');
    expect(html).toContain('1000+');
    // Ensure white swatch appears (0 words)
    expect(html).toMatch(/background:#ffffff/);
  });
}); 
