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

describe('Calendar heatmap and per-day pages', () => {
  it('dashboard renders calendar with weekday headers and day links', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const home = read('index.html');
    // Weekday headers
    for (const w of ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']) {
      expect(home).toContain(`>${w}<`);
    }
    // A known day from hello-world frontmatter
    expect(home).toMatch(/href="\/days\/2025-08-01\//);
  });

  it('per-day page exists and lists posts written that day', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    // hello-world has date 2025-08-01
    const rel = 'days/2025-08-01/index.html';
    expect(exists(rel)).toBe(true);
    const html = read(rel);
    expect(html).toContain('Posts on 2025-08-01');
    expect(html).toContain('/posts/hello-world/');
  });
});
