// Tag helpers used by Eleventy collections
function normalizeTags(arr) {
  return Array.from(new Set((arr || [])
    .map((t) => String(t || '').toLowerCase().trim())
    .filter((t) => t && !['post','posts','all'].includes(t))
  ));
}

function collectTagMap(posts) {
  const map = {};
  for (const p of posts) {
    const tags = normalizeTags(p?.data?.tags);
    for (const t of tags) {
      (map[t] ||= []).push(p);
    }
  }
  return map;
}

function tagListFromMap(map) {
  const list = Object.entries(map).map(([tag, arr]) => ({ tag, count: arr.length }));
  list.sort((a, b) => (b.count - a.count) || a.tag.localeCompare(b.tag));
  return list;
}

module.exports = { normalizeTags, collectTagMap, tagListFromMap };
