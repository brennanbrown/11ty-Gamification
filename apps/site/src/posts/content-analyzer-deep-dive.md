---
title: Content Analyzer Deep Dive
date: 2025-08-13
tags: [analyzer, words, architecture]
---

The content analyzer powers word counts and reading-time estimates. It strips front matter, ignores code (inline and fenced), and treats decimals as single tokens.

Design choices:

- Deterministic: same input, same counts.
- Practical: skip heavy NLP to keep builds fast.
- Testable: fixtures cover front matter, unicode, lists, and code blocks.

Future: optional headings/sections metadata for richer per-post stats.
