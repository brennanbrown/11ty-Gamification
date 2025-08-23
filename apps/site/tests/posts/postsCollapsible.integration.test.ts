import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Home page posts section is collapsible; posts page is simple list', () => {
  it('renders collapsible section on home and not on /posts/', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });

    const home = read('index.html');
    expect(home).toContain('data-collapsible="posts"');
    expect(home).toContain('<summary');
    expect(home).toMatch(/<details[^>]*data-collapsible="posts"[\s\S]*<table[\s\S]*<\/table>[\s\S]*<\/details>/);

    const posts = read('posts/index.html');
    expect(posts).not.toContain('data-collapsible="posts"');
  });
});
