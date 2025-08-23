import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Footer content', () => {
  it('renders licenses, author link, repo link, and attribution', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('index.html');

    // Licenses
    expect(html).toMatch(/Code licensed\s*<strong>MIT<\/strong>/);
    expect(html).toMatch(/Content licensed\s*<strong>CC BY-NC-SA 4\.0<\/strong>/);

    // Author link
    expect(html).toContain('Brennan Kenneth Brown');
    expect(html).toContain('https://brennanbrown.ca');

    // Repo link (repoUrl from site data)
    expect(html).toMatch(/Source on GitHub/);

    // Inspiration attribution
    expect(html).toContain('Inspired by');
    expect(html).toContain('750words');
    expect(html).toContain('Buster Benson');
  });
});
