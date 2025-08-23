import { describe, it, expect } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildSearch = require('../../src/_data/searchIndex.js');

describe('searchIndex data builder', () => {
  const make = (url: string, title: string, tags: any[], html: string) => ({
    url,
    data: { title, tags },
    templateContent: html,
  });

  const posts = [
    make('/posts/a/', 'A Post', ['Foo', 'posts'], '<p>Hello <strong>world</strong>.</p>'),
    make('/posts/b/', 'B Post', ['foo', 'Bar'], '<h2>Intro</h2><p>Second para.</p>'),
  ];

  it('normalizes tags, strips HTML, and creates excerpts', () => {
    const eleventyData = { collections: { all: posts } };
    const idx = buildSearch(eleventyData);
    expect(idx).toHaveLength(2);

    const a = idx.find((i: any) => i.url === '/posts/a/');
    expect(a.title).toBe('A Post');
    expect(a.tags).toEqual(['foo']);
    expect(a.excerpt).toMatch(/Hello world/);

    const b = idx.find((i: any) => i.url === '/posts/b/');
    expect(b.tags.sort()).toEqual(['bar', 'foo']);
    expect(b.excerpt).toMatch(/Intro Second para/);
  });
});
