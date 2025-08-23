import { describe, it, expect } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tags = require('../src/_lib/tags.js');

describe('tag helpers', () => {
  const makePost = (url: string, t: string[]) => ({ url, data: { tags: t } });
  const posts = [
    makePost('/posts/a/', ['Foo', 'bar', 'posts']),
    makePost('/posts/b/', ['foo', 'baz']),
    makePost('/posts/c/', ['bar']),
    makePost('/notes/skip/', ['foo']) // non-post URL may be filtered by collection, but helpers shouldn't break
  ];

  it('normalizeTags lowercases and filters reserved', () => {
    expect(tags.normalizeTags(['Post', 'All', 'Foo', '']))
      .toEqual(['foo']);
  });

  it('collectTagMap groups by normalized tag', () => {
    const map = tags.collectTagMap(posts);
    expect(Object.keys(map).sort()).toEqual(['bar', 'baz', 'foo']);
    expect(map.foo.length).toBe(3);
    expect(map.bar.length).toBe(2);
  });

  it('tagListFromMap sorts by count desc then alpha', () => {
    const map = tags.collectTagMap(posts);
    const list = tags.tagListFromMap(map);
    expect(list.map((i: any) => `${i.tag}:${i.count}`)).toEqual([
      'foo:3', 'bar:2', 'baz:1'
    ]);
  });
});
