---
title: Development Notes
date: 2025-08-21
tags: [development]
layout: post.njk
---

A living note with tips and conventions for working on this monorepo.

## Monorepo structure

- `apps/site/` — Eleventy site and dashboard.
- `packages/content-analyzer/` — shared analyzer for word counts and reading minutes.
- `packages/site-utils/` — small utilities shared by the site (e.g., tag colors).

## Running tests

Use Vitest:

```bash
npm test
```

Run a single test file:

```bash
npx vitest run apps/site/tests/siteBuild.integration.test.ts
```

## Building the site locally

```bash
cd apps/site
npx eleventy
```

The output is written to `_site/`.

## Styling

Tailwind is processed during the `build` script, but HTML integration tests don't require CSS to run.

## Data builders

- `src/_data/analyzer.js` — totals and per-post stats (words, minutes).
- `src/_data/activity.js` — streaks, recent windows, and calendars.
- `src/_data/badges.js` — computes earned badges from analyzer + activity.

## Conventions

- Prefer UTC normalization in date logic for deterministic builds.
- Keep integration tests hermetic and avoid polluting the workspace.
- Every implementation step should come with tests.
