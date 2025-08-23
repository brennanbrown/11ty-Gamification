import { describe, it, expect } from 'vitest';

// Use CommonJS require to load Eleventy data files
// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildTagsList = require('../../src/_data/tagsList.js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildTagMap = require('../../src/_data/tagMap.js');

describe('Eleventy _data tags builders', () => {
  const makePost = (url: string, title: string, tags: string[]) => ({
    url,
    data: { title, tags },
    date: new Date('2025-08-01')
  });

  const posts = [
    makePost('/posts/a/', 'A', ['Foo', 'bar', 'posts']),
    makePost('/posts/b/', 'B', ['foo', 'baz']),
    makePost('/posts/c/', 'C', ['bar']),
  ];
  const eleventyData = { collections: { all: posts } };

  it('tagsList counts and sorts by count desc then alpha', () => {
    const list = buildTagsList(eleventyData);
    expect(list.map((i: any) => `${i.tag}:${i.count}`)).toEqual([
      'bar:2', 'foo:2', 'baz:1'
    ]);
  });

  it('tagMap maps normalized tag to its posts', () => {
    const map = buildTagMap(eleventyData);
    expect(Object.keys(map).sort()).toEqual(['bar', 'baz', 'foo']);
    expect(map.foo.map((p: any) => p.data.title).sort()).toEqual(['A', 'B']);
    expect(map.bar.map((p: any) => p.data.title).sort()).toEqual(['A', 'C']);
  });
});
