// Build a lightweight search index from collections.all
// Fields: { url, title, tags[], excerpt }

function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeTags(tags) {
  const reserved = new Set(['post', 'posts', 'all']);
  const set = new Set();
  for (const t of (tags || [])) {
    if (!t) continue;
    const v = String(t).toLowerCase();
    if (!reserved.has(v)) set.add(v);
  }
  return Array.from(set);
}

module.exports = function(eleventyData) {
  const all = (eleventyData && eleventyData.collections && eleventyData.collections.all) || [];
  return all
    .filter((p) => p.url && p.url.startsWith('/posts/'))
    .map((p) => {
      const title = p.data && p.data.title ? String(p.data.title) : '';
      const tags = normalizeTags(p.data && p.data.tags);
      const content = stripHtml(p.templateContent || '');
      const excerpt = content.substring(0, 180).trim();
      return { url: p.url, title, tags, excerpt };
    });
};
