export type PostLike = {
  fileSlug?: string;
  url?: string;
  data: {
    title?: string;
    tags?: string[];
    date?: string | Date;
  };
};

export type TagInfo = {
  tag: string;
  count: number;
};

export type TagCollection = {
  map: Map<string, PostLike[]>;
  list: TagInfo[]; // sorted by count desc, then alpha
};

export function normalizeTags(tags?: (string | null | undefined)[]): string[] {
  if (!tags) return [];
  return Array.from(
    new Set(
      tags
        .filter((t): t is string => typeof t === 'string' && !!t.trim())
        .map((t) => t.toLowerCase())
        .filter((t) => !['post', 'posts', 'all'].includes(t))
    )
  );
}

export function collectTags(posts: PostLike[]): TagCollection {
  const map = new Map<string, PostLike[]>();
  for (const p of posts) {
    const tags = normalizeTags(p?.data?.tags);
    for (const t of tags) {
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(p);
    }
  }
  const list = Array.from(map.entries()).map(([tag, arr]) => ({ tag, count: arr.length }));
  list.sort((a, b) => (b.count - a.count) || a.tag.localeCompare(b.tag));
  return { map, list };
}
