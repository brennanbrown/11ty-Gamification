// Build a list of tags with counts from collections.all
// Tries to use @indiegarden/site-utils; falls back to local helpers.

function fallbackNormalizeTags(tags) {
  if (!tags) return [];
  return Array.from(
    new Set(
      tags
        .filter((t) => typeof t === 'string' && !!t.trim())
        .map((t) => t.toLowerCase())
        .filter((t) => !['post', 'posts', 'all'].includes(t))
    )
  );
}

function fallbackCollectTags(posts) {
  const map = new Map();
  for (const p of posts) {
    const tags = fallbackNormalizeTags(p?.data?.tags);
    for (const t of tags) {
      if (!map.has(t)) map.set(t, []);
      map.get(t).push(p);
    }
  }
  const list = Array.from(map.entries()).map(([tag, arr]) => ({ tag, count: arr.length }));
  list.sort((a, b) => (b.count - a.count) || a.tag.localeCompare(b.tag));
  return { map, list };
}

module.exports = function(eleventyData) {
  const posts = (eleventyData && eleventyData.collections && eleventyData.collections.all) || [];
  let collectTags;
  try {
    // eslint-disable-next-line node/no-missing-require
    ({ collectTags } = require('@indiegarden/site-utils/dist/tags.js'));
  } catch (e) {
    collectTags = fallbackCollectTags;
  }
  const { list } = collectTags(posts);
  return list;
};
