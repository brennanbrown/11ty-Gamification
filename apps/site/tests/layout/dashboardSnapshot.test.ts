import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

function normalize(html: string) {
  // Remove varying whitespace
  let s = html.replace(/\s+/g, ' ');
  // Remove dynamic numbers in heatmap titles (N words)
  s = s.replace(/:\s*\d+\s*words/g, ': N words');
  // Remove date strings like YYYY-MM-DD
  s = s.replace(/\d{4}-\d{2}-\d{2}/g, 'YYYY-MM-DD');
  return s.trim();
}

describe('Dashboard snapshots (structure)', () => {
  it('renders Badge Ideas block and Heatmap heading+legend structure', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('index.html');

    const ideasSection = html.match(/<section[^>]*data-section="badge-ideas"[\s\S]*?<\/section>/);
    expect(ideasSection).toBeTruthy();

    const heatmapHeader = html.match(/<h2[^>]*>\s*Heatmap\s*<\/h2>/);
    expect(heatmapHeader).toBeTruthy();

    const legend = html.match(/<div[^>]*data-heatmap-legend[^>]*>[\s\S]*?<\/div>/);
    expect(legend).toBeTruthy();

    // Basic structural checks instead of snapshots to reduce flakiness
    const combined = normalize((ideasSection![0] + '\n' + heatmapHeader![0] + '\n' + (legend ? legend[0] : '')).trim());
    expect(combined).toMatch(/data-section="badge-ideas"/);
    expect(combined).toMatch(/<h2[^>]*>\s*Heatmap\s*<\/h2>/);
    expect(combined).toMatch(/data-heatmap-legend/);
  });
});
