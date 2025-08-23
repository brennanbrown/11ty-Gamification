import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Sticky footer layout', () => {
  it('uses flex column body and growing main content', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('index.html');

    // body has display:flex and flex-direction:column styles in the inline <style>
    expect(html).toMatch(/body\s*{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;/s);

    // main has the class that sets flex:1 0 auto
    expect(html).toContain('<main class="container page-main">');
  });
});
