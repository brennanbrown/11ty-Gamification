module.exports = function(eleventyConfig) {
  // Add passthroughs or filters here as we build out
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

  // Collections for tags (built after content is read)
  const tagHelpers = require('./src/_lib/tags.js');
  eleventyConfig.addCollection('tagMap', (collectionApi) => {
    const all = collectionApi.getAll();
    const posts = all.filter((p) => p.url && p.url.startsWith('/posts/'));
    return tagHelpers.collectTagMap(posts);
  });
  eleventyConfig.addCollection('tagsList', (collectionApi) => {
    const all = collectionApi.getAll();
    const posts = all.filter((p) => p.url && p.url.startsWith('/posts/'));
    const map = tagHelpers.collectTagMap(posts);
    return tagHelpers.tagListFromMap(map);
  });

  // Collections for categories (mirrors tags behavior)
  function normalizeCategories(arr) {
    return Array.from(new Set((arr || [])
      .filter((c) => typeof c === 'string' && !!c.trim())
      .map((c) => c.toLowerCase().trim())
    ));
  }
  eleventyConfig.addCollection('categoryMap', (collectionApi) => {
    const all = collectionApi.getAll();
    const posts = all.filter((p) => p.url && p.url.startsWith('/posts/'));
    const map = {};
    for (const p of posts) {
      const cats = normalizeCategories(p?.data?.categories);
      for (const c of cats) {
        (map[c] ||= []).push(p);
      }
    }
    return map;
  });
  eleventyConfig.addCollection('categoriesList', (collectionApi) => {
    const map = eleventyConfig.getFilter('identity')
      ? collectionApi.getFilteredByGlob('**/*') && {} // noop ensure collectionApi used
      : {};
    const catMap = eleventyConfig.javascriptFunctions?.categoryMap
      ? eleventyConfig.javascriptFunctions.categoryMap
      : (function() {
          const all = collectionApi.getAll();
          const posts = all.filter((p) => p.url && p.url.startsWith('/posts/'));
          const m = {};
          for (const p of posts) {
            const cats = normalizeCategories(p?.data?.categories);
            for (const c of cats) (m[c] ||= []).push(p);
          }
          return m;
        })();
    const list = Object.entries(catMap).map(([category, arr]) => ({ category, count: arr.length }));
    list.sort((a, b) => (b.count - a.count) || a.category.localeCompare(b.category));
    return list;
  });

  // Attempt to use shared utilities; fall back to local lightweight impl if not built
  let utils;
  try {
    // eslint-disable-next-line node/no-missing-require
    utils = require('@indiegarden/site-utils/dist/tagColors.js');
  } catch (e) {
    // Fallback minimal implementations
    function hashTag(str) {
      let h = 0x811c9dc5 >>> 0;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
      }
      return h >>> 0;
    }
    function hueFromHash(tag) {
      const h = hashTag(String(tag || '').toLowerCase());
      return (h % 360 + ((h >>> 9) % 7)) % 360;
    }
    function hslToRgb(h, s, l) {
      const S = s / 100; const L = l / 100;
      const C = (1 - Math.abs(2 * L - 1)) * S;
      const Hp = h / 60; const X = C * (1 - Math.abs((Hp % 2) - 1));
      let r1=0,g1=0,b1=0;
      if (0 <= Hp && Hp < 1) [r1,g1,b1] = [C,X,0];
      else if (1 <= Hp && Hp < 2) [r1,g1,b1] = [X,C,0];
      else if (2 <= Hp && Hp < 3) [r1,g1,b1] = [0,C,X];
      else if (3 <= Hp && Hp < 4) [r1,g1,b1] = [0,X,C];
      else if (4 <= Hp && Hp < 5) [r1,g1,b1] = [X,0,C];
      else [r1,g1,b1] = [C,0,X];
      const m = L - C/2;
      return { r: Math.round((r1+m)*255), g: Math.round((g1+m)*255), b: Math.round((b1+m)*255)};
    }
    function rgbToHex(r,g,b){ const toHex=n=>n.toString(16).padStart(2,'0'); return `#${toHex(r)}${toHex(g)}${toHex(b)}`; }
    function tagColor(tag){ const h=hueFromHash(tag); const {r,g,b}=hslToRgb(h,72,55); return rgbToHex(r,g,b); }
    function tagTextColor(bg){
      const m = /^#([0-9a-f]{6})$/i.exec(bg||'');
      if(!m) return '#111111';
      const num = parseInt(m[1],16); const r=(num>>16)&255,g=(num>>8)&255,b=num&255;
      const yiq=(r*299+g*587+b*114)/1000;
      return yiq>=140?'#111111':'#ffffff';
    }
    utils = { tagColor, tagTextColor };
  }

  eleventyConfig.addFilter('tagColor', (tag) => utils.tagColor(tag));
  eleventyConfig.addFilter('tagTextColor', (bgOrTag) => {
    if (/^#/.test(String(bgOrTag))) return utils.tagTextColor(bgOrTag);
    const bg = utils.tagColor(bgOrTag);
    return utils.tagTextColor(bg);
  });

  // Simple date filter: supports 'yyyy-LL-dd' default
  eleventyConfig.addFilter('date', (input, pattern = 'yyyy-LL-dd') => {
    const d = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    if (pattern === 'yyyy-LL-dd') return `${yyyy}-${mm}-${dd}`;
    // Fallback ISO
    return d.toISOString();
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data'
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
};
