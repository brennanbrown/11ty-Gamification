import { describe, it, expect, beforeEach } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(p: string) {
  return fs.readFileSync(p, 'utf8');
}

describe('categories pages (integration)', () => {
  beforeEach(() => {
    // Build fresh
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
  });

  it('renders categories index with at least one category', () => {
    const index = path.join(outDir, 'categories', 'index.html');
    expect(fs.existsSync(index)).toBe(true);
    const html = read(index);
    expect(html).toContain('<h1');
    // Our fixture includes category 'guides' and 'writing'
    expect(html).toMatch(/guides|writing/);
  });

  it('renders a category page with its posts', () => {
    const page = path.join(outDir, 'categories', 'guides', 'index.html');
    expect(fs.existsSync(page)).toBe(true);
    const html = read(page);
    expect(html).toContain('Categories Fixture Post');
    // Has date or link structure
    expect(html).toMatch(/\d{4}-\d{2}-\d{2}|<a href="\/posts\//);
  });
});
