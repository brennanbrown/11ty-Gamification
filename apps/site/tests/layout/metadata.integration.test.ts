import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const cacheDir = path.join(siteDir, 'src/.cache/metadata');
const cacheFile = path.join(cacheDir, 'enrichment.json');

function readJSON(p: string) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

describe('metadata enrichment (integration)', () => {
  const prev = process.env.METADATA_ENABLED;
  beforeEach(() => {
    process.env.METADATA_ENABLED = '1';
    try { fs.rmSync(cacheDir, { recursive: true, force: true }); } catch {}
  });
  afterEach(() => {
    if (prev == null) delete process.env.METADATA_ENABLED; else process.env.METADATA_ENABLED = prev;
  });

  it('writes enrichment cache and includes per-day entries', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    expect(fs.existsSync(cacheFile)).toBe(true);

    const data = readJSON(cacheFile);
    expect(data.enabled).toBe(true);
    // Should include at least some dates; activity builder includes byDay for sample content
    const keys = Object.keys(data.itemsByDate || {});
    expect(keys.length).toBeGreaterThan(0);
    // Ensure each item has tz and moon fields
    for (const k of keys) {
      const item = data.itemsByDate[k];
      expect(typeof item.tz).toBe('string');
      expect(typeof item.moon).toBe('string');
    }
  });
});
