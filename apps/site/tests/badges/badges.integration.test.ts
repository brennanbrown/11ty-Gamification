import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Badges and dashboard UI', () => {
  it('renders a single 750-word Sparkles badge, centered Heatmap, shows current streak, and renders streak badge when earned', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('index.html');
    // Exactly one Sparkles emoji (✨)
    const sparklesMatches = html.match(/✨/g) || [];
    expect(sparklesMatches.length).toBe(1);
    // Centered Heatmap header (allow additional classes)
    expect(html).toMatch(/<h2[^>]*class="[^"]*text-center[^"]*"[^>]*>\s*Heatmap\s*<\/h2>/);
    // Current streak present
    expect(html).toMatch(/Current streak:\s*\d+\s*days/);

    // If streak >= 3, at least one streak badge emoji should render
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const buildActivity = require('../../src/_data/activity.js');
    const activity = buildActivity({});
    if ((activity.streak || 0) >= 3) {
      const hasStreakEmoji = /(🌱|🌿|🍀|🌸|🌻)/.test(html);
      expect(hasStreakEmoji).toBe(true);
    }
  });
});
