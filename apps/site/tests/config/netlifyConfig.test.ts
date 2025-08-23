import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '../../../..');

describe('Netlify configuration', () => {
  it('has a netlify.toml with required build settings', () => {
    const file = path.join(repoRoot, 'netlify.toml');
    expect(fs.existsSync(file)).toBe(true);
    const txt = fs.readFileSync(file, 'utf8');
    expect(txt).toMatch(/\[build\]/);
    expect(txt).toMatch(/base\s*=\s*"apps\/site"/);
    expect(txt).toMatch(/command\s*=\s*"npm run build"/);
    expect(txt).toMatch(/publish\s*=\s*"apps\/site\/_site"/);
  });
});
