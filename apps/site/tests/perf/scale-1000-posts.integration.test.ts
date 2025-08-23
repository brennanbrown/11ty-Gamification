import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const siteDir = path.resolve(__dirname, '../../');
const req = createRequire(import.meta.url);
let tempDir = '';
let postsDir = '';
let outDir = '';

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function writePost(idx: number, dateISO: string, words: number) {
  const slug = `gen-${dateISO}-${String(idx).padStart(4, '0')}`;
  const title = `Generated Post ${idx}: A Realistic Note`;
  const tagsArr = [idx % 5 === 0 ? 'longform' : 'daily'];
  const paragraphs = Math.max(1, Math.floor(words / 120));
  const body = Array.from({ length: paragraphs }, (_, p) =>
    `This is paragraph ${p + 1} of a generated post to simulate realistic content with about ${Math.round(words / paragraphs)} words total. ` +
    'It includes some topics like writing, coding, and daily reflections to emulate real notes.'
  ).join('\n\n');
  const fm = `---\n` +
    `title: ${JSON.stringify(title)}\n` +
    `date: ${dateISO}\n` +
    `tags: [${tagsArr.map(t => JSON.stringify(t)).join(', ')}]\n` +
    `---\n\n${body}\n`;
  const file = path.join(postsDir, `${slug}.md`);
  fs.writeFileSync(file, fm, 'utf8');
}

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

function copyDirSync(src: string, dest: string) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else if (entry.isFile()) fs.copyFileSync(s, d);
  }
}

describe.sequential('Scale build with 1000 realistic posts', () => {
  beforeAll(() => {
    // Create isolated temp working copy with just what's needed
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'indiegarden-scale-'));
    // Copy src/
    copyDirSync(path.join(siteDir, 'src'), path.join(tempDir, 'src'));
    // Copy Eleventy config
    const configSrc = path.join(siteDir, '.eleventy.js');
    if (fs.existsSync(configSrc)) fs.copyFileSync(configSrc, path.join(tempDir, '.eleventy.js'));
    // Prepare output and generated posts dir
    postsDir = path.join(tempDir, 'src', 'posts', 'generated');
    outDir = path.join(tempDir, '_site');
    ensureDir(postsDir);
    // Generate 1000 posts over ~400 days, ensure a 3-day streak up to today
    const today = new Date();
    const fmtUTC = (d: Date) => {
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const da = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${da}`;
    };

    // Guarantee streak for today, yesterday, and day before
    for (let i = 0; i < 3; i++) {
      const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
      writePost(9000 + i, fmtUTC(d), 200); // short posts ok
    }

    // Distribute remaining posts
    const total = 1000;
    for (let n = 0; n < total; n++) {
      const delta = Math.floor(Math.random() * 400) + 3; // keep separate from the streak days
      const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - delta));
      const words = n % 50 === 0 ? 900 : 180; // every ~50th is long to boost totals
      writePost(n, fmtUTC(d), words);
    }
  });

  afterAll(() => {
    // Cleanup temp directory recursively
    try { if (tempDir && fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true }); } catch {}
  });

  it('builds successfully and renders badges with >= 1000 posts counted', () => {
    // Run Eleventy from the site workspace (so devDeps resolve), targeting temp copy
    const cmd = `npx eleventy --config=${JSON.stringify(path.join(tempDir, '.eleventy.js'))} --input=${JSON.stringify(path.join(tempDir, 'src'))} --output=${JSON.stringify(outDir)}`;
    try {
      execSync(cmd, { cwd: siteDir, stdio: 'pipe' });
    } catch (e: any) {
      const stderr = e?.stderr ? Buffer.from(e.stderr).toString() : '';
      const stdout = e?.stdout ? Buffer.from(e.stdout).toString() : '';
      throw new Error(`Eleventy build failed.\nCMD: ${cmd}\nCWD: ${siteDir}\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`);
    }
    const html = read('index.html');

    // Sparkles either via badges or fallback
    expect(html).toMatch(/Sparkles|\u2728|✨/);

    // Current streak should be at least 3 days
    const streakMatch = html.match(/Current streak:\s*(\d+)\s*days/);
    expect(streakMatch).not.toBeNull();
    // Compute streak using activity builder over the generated posts in tempDir
    const buildActivity = req(path.join(siteDir, 'src/_data/activity.js'));
    const genFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    const all = genFiles.map(file => {
      const slug = file.replace(/\.[^.]+$/, '');
      const m = slug.match(/^gen-(\d{4}-\d{2}-\d{2})-/);
      const dateISO = m ? m[1] : '1970-01-01';
      return { url: `/posts/${slug}/`, date: new Date(dateISO), data: { title: slug } };
    });
    const activityData = buildActivity({ collections: { all } });
    expect(activityData.streak).toBeGreaterThanOrEqual(3);

    // Analyzer totals should report >= 1000 posts
    // Extract the totals posts card content
    const postsCard = html.match(/<div class=\"text-sm opacity-70\">Posts<\/div><div class=\"text-2xl font-semibold\">(\d+)<\/div>/);
    expect(postsCard).not.toBeNull();
    if (postsCard) {
      expect(Number(postsCard[1])).toBeGreaterThanOrEqual(1000);
    }
  });
});
