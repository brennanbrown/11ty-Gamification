import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve(__dirname, '../../');
const outDir = path.join(siteDir, '_site');

function read(rel: string) {
  return fs.readFileSync(path.join(outDir, rel), 'utf8');
}

describe('Heatmap heading spacing and Badge Ideas compact layout', () => {
  it('applies larger, bold Heatmap title with extra spacing and compacts Badge Ideas grid', () => {
    execSync('npx eleventy', { cwd: siteDir, stdio: 'pipe' });
    const html = read('index.html');

    // Heatmap heading classes are responsive: mt-12 on base, md:mt-16 on md+
    expect(html).toMatch(
      /<h2[^>]*class="[^"]*text-2xl[^"]*font-bold[^"]*text-center[^"]*mt-12[^"]*md:mt-16[^"]*mb-2[^"]*"[^>]*>\s*Heatmap\s*<\/h2>/
    );

    // Badge Ideas section has extra bottom margin (allow any attribute order)
    const badgeIdeasOpenTag = html.match(/<section[^>]*data-section=\"badge-ideas\"[^>]*>/) || html.match(/<section[^>]*class=\"[^\"]*\"[^>]*data-section=\"badge-ideas\"[^>]*>/);
    expect(badgeIdeasOpenTag).toBeTruthy();
    expect(badgeIdeasOpenTag![0]).toMatch(/class=\"[^"]*mb-24[^"]*\"/);

    // Badge Ideas grid uses tighter gap and smaller max width
    expect(html).toMatch(
      /<div[^>]*class="[^"]*grid-cols-3[^"]*gap-3[^"]*max-w-sm[^"]*"/
    );

    // Badge icon size reduced
    expect(html).toMatch(
      /data-badge-idea="first-post"[^>]*style="[^"]*width:2rem; height:2rem; font-size:1.1rem;[^"]*"/
    );
  });
});
