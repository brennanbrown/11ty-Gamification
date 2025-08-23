// Analyzer data builder: computes per-post stats and site totals.
// Tries to use @indiegarden/content-analyzer; falls back to a simple implementation.

const fs = require('fs');

// Always define a simple markdown analyzer as a fallback.
const STRIP_FM = /^---[\s\S]*?---\n?/; // naive frontmatter strip
const stripCode = (md) => md
  .replace(/```[\s\S]*?```/g, '')
  .replace(/`[^`]*`/g, '');
const countWords = (text) => {
  const cleaned = stripCode(String(text || '').replace(STRIP_FM, ''));
  const tokens = cleaned.match(/[\p{L}\p{N}]+(?:\.[\p{N}]+)?/gu) || [];
  return tokens.length;
};
const readingTimeMinutes = (w) => Math.max(1, Math.round(w / 200));
const fallbackAnalyze = (md) => {
  const words = countWords(md);
  const minutes = readingTimeMinutes(words);
  return { words, minutes };
};

let externalAnalyze;
try {
  // eslint-disable-next-line node/no-missing-require
  ({ analyzeContent: externalAnalyze } = require('@indiegarden/content-analyzer/dist/index.js'));
} catch (e) {
  externalAnalyze = undefined;
}

function analyze(md) {
  const text = String(md || '');
  if (externalAnalyze) {
    try {
      const res = externalAnalyze(text);
      if (res && typeof res.words === 'number' && res.words > 0) return res;
    } catch (_) {
      // ignore and fallback
    }
  }
  return fallbackAnalyze(text);
}

function collectPostsFromFs() {
  const path = require('path');
  // This data file lives at apps/site/src/_data/analyzer.js
  // Posts live at apps/site/src/posts. Resolve relative to this file to be robust
  // regardless of Eleventy CWD.
  const postsDir = path.join(__dirname, '..', 'posts');
  const result = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (/\.md$/i.test(name)) {
        // Derive url from path within posts directory
        const rel = path.relative(postsDir, full).replace(/\\/g, '/');
        const slug = rel.replace(/\.md$/i, '');
        const url = `/posts/${slug}/`;
        const md = fs.readFileSync(full, 'utf8');
        result.push({ url, inputPath: full, templateContent: md, data: {} });
      }
    }
  }
  walk(postsDir);
  return result;
}

module.exports = function(eleventyData) {
  const all = (eleventyData && eleventyData.collections && eleventyData.collections.all) || [];
  let posts = all.filter((p) => p.url && p.url.startsWith('/posts/'));
  if (!posts.length) {
    posts = collectPostsFromFs();
  }

  const perPost = {};
  let totalWords = 0;
  let totalMinutes = 0;

  for (const p of posts) {
    let md = p.templateContent || '';
    if (!md && p.inputPath && fs.existsSync(p.inputPath)) {
      try {
        md = fs.readFileSync(p.inputPath, 'utf8');
      } catch (_) {
        md = '';
      }
    }
    const { words, minutes } = analyze(md);
    perPost[p.url] = { words, minutes };
    totalWords += words;
    totalMinutes += minutes;
  }

  const totals = {
    posts: posts.length,
    words: totalWords,
    minutes: totalMinutes,
  };

  return { perPost, totals };
};
