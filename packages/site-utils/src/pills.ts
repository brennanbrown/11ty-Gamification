import { tagColor, tagTextColor } from './tagColors';

export type TagPill = { tag: string; bg: string; text: string };

export function computeTagPills(tags: string[] | undefined | null): TagPill[] {
  const set = new Set<string>((tags || []).filter(Boolean).map((t) => String(t).toLowerCase()));
  const cleaned = Array.from(set).filter((t) => !['post', 'posts', 'all'].includes(t));
  return cleaned.map((tag) => {
    const bg = tagColor(tag);
    const text = tagTextColor(bg);
    return { tag, bg, text };
  });
}
