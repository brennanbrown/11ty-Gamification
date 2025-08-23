---
title: Scale Testing the Badge Engine
date: 2025-08-20
tags: [testing, development]
layout: post.njk
---

Notes on how we stabilized the 1000-post scalability test for the Badge Engine.

## Goals

- Generate ~1000 realistic posts with varied dates and lengths.
- Build the site without polluting the workspace.
- Verify badges, streaks, and totals render under load.

## Approach

1. Run the scale test in a temporary copy of the site.
2. Invoke Eleventy from the real workspace but point `--config`, `--input`, and `--output` to the temp copy.
3. Generate posts that guarantee a 3-day streak ending today and distribute the rest across ~400 days.
4. Assert:
   - Build succeeds.
   - Sparkles appears (either earned or fallback).
   - Current streak ≥ 3 days (verified via activity data builder).
   - Analyzer totals show ≥ 1000 posts.

## Why isolate?

Running the build in-place polluted other tests that depend on the canonical content. Isolation keeps the rest of the suite deterministic and fast.

## Tips

- Normalize dates to UTC day boundaries in data builders.
- Quote YAML front matter values (titles and tags) in generated content.
- Use `describe.sequential()` for heavy integration tests that manipulate shared resources.
