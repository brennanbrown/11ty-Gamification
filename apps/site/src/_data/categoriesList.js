// Build a list of categories with counts from collections.all
// Mirrors tagsList.js behavior

function fallbackNormalizeCategories(cats) {
  if (!cats) return [];
  return Array.from(
    new Set(
      cats
        .filter((c) => typeof c === 'string' && !!c.trim())
        .map((c) => c.toLowerCase())
    )
  );
}

function fallbackCollectCategories(posts) {
  const map = new Map();
  for (const p of posts) {
    const cats = fallbackNormalizeCategories(p?.data?.categories);
    for (const c of cats) {
      if (!map.has(c)) map.set(c, []);
      map.get(c).push(p);
    }
  }
  const list = Array.from(map.entries()).map(([category, arr]) => ({ category, count: arr.length }));
  list.sort((a, b) => (b.count - a.count) || a.category.localeCompare(b.category));
  return { map, list };
}

module.exports = function(eleventyData) {
  const posts = (eleventyData && eleventyData.collections && eleventyData.collections.all) || [];
  // Optionally try site-utils in future; use fallback for now
  const { list } = fallbackCollectCategories(posts);
  return list;
};
