// Map of category -> posts[] for rendering category pages
const buildFallback = require('./categoriesList');

module.exports = function(eleventyData) {
  const posts = (eleventyData && eleventyData.collections && eleventyData.collections.all) || [];
  // Build the keys first from the list builder
  const list = buildFallback(eleventyData);
  const map = {};
  for (const item of list) map[item.category] = [];

  const normalize = (arr) => (arr || [])
    .filter((c) => typeof c === 'string' && !!c.trim())
    .map((c) => c.toLowerCase());

  for (const p of posts) {
    const cats = Array.from(new Set(normalize(p?.data?.categories)));
    for (const c of cats) {
      if (map[c]) map[c].push(p);
    }
  }
  return map;
};
