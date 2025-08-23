// Map of tag -> posts[] for rendering tag pages
const buildFallback = require('./tagsList');

module.exports = function(eleventyData) {
  const posts = (eleventyData && eleventyData.collections && eleventyData.collections.all) || [];
  let collectTags;
  try {
    ({ collectTags } = require('@indiegarden/site-utils/dist/tags.js'));
  } catch (e) {
    // fallback: reuse internal functions from tagsList.js
    const listBuilder = buildFallback(eleventyData);
    // Rebuild map from list + posts
    const map = {};
    for (const item of listBuilder) {
      map[item.tag] = [];
    }
    const normalize = (arr) => (arr || []).map((t) => String(t || '').toLowerCase()).filter((t) => t && !['post','posts','all'].includes(t));
    for (const p of posts) {
      const tags = Array.from(new Set(normalize(p?.data?.tags)));
      for (const t of tags) {
        if (map[t]) map[t].push(p);
      }
    }
    return map;
  }
  const { map } = collectTags(posts);
  // Convert Map to plain object for templates
  return Object.fromEntries(map.entries());
};
