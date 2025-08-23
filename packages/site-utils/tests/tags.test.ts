import { describe, it, expect } from 'vitest';
import { normalizeTags, collectTags, type PostLike } from '../src/tags';

describe('normalizeTags', () => {
  it('lowercases, filters falsy, removes reserved tags', () => {
    const input = ['JavaScript', '', null as any, 'All', 'posts', 'css', 'Post', 'CSS'];
    const out = normalizeTags(input);
    expect(out).toEqual(['javascript', 'css']);
  });

  it('de-duplicates while preserving normalized order', () => {
    const input = ['a', 'A', 'b', 'a'];
    const out = normalizeTags(input);
    expect(out).toEqual(['a', 'b']);
  });
});

describe('collectTags', () => {
  const posts: PostLike[] = [
    { fileSlug: 'intro', url: '/intro/', data: { title: 'Intro', tags: ['Welcome', 'Project'] } },
    { fileSlug: 'guide', url: '/guide/', data: { title: 'Guide', tags: ['project', 'howto'] } },
    { fileSlug: 'release', url: '/release/', data: { title: 'Release', tags: ['changelog', 'project'] } },
    { fileSlug: 'css', url: '/css/', data: { title: 'CSS', tags: ['css', 'HowTo'] } },
  ];

  it('builds a tag map and sorted list by count then alpha', () => {
    const { map, list } = collectTags(posts);
    expect(map.get('project')?.length).toBe(3);
    expect(map.get('howto')?.length).toBe(2);
    expect(list[0]).toEqual({ tag: 'project', count: 3 });
    // next should be howto (2) vs changelog/css/welcome (1)
    expect(list[1].tag).toBe('howto');
    expect(list[list.length - 1].count).toBe(1);
  });
});
