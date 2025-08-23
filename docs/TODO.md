# Project TODO

A living task list for the Gamified Writing Dashboard (11ty). Status is tracked here and mirrored in our internal task board.

## Conventions

- Testing-first: every step includes unit tests and we reference them after each step.
- Monorepo with npm workspaces, TypeScript for plugins, Vitest for unit/integration, Playwright for E2E.
- Features globally enabled by default; per-post overrides are opt-out.
- Default badge theme: Plants/Growth; behavior/special badges are lower priority.

## Phases and Tasks

### Phase 0 — Scaffolding
- [x] Initialize 11ty starter app (`apps/site/`) and base structure
- [x] Set up npm workspaces and package scripts
- [x] TypeScript config, ESLint/Prettier
- [x] Vitest test runner + coverage tooling
- [x] GitHub Actions skeleton (lint/test/build)

### Phase 1 — Core Data Pipeline
- [ ] Define data contracts (frontmatter schema, per-post computed data, `_data/*.json` formats)
- [x] Content Analyzer plugin (word count, reading time)
  - [x] Unit tests (different languages, empty content, punctuation)
- [x] Metadata Enrichment plugin (geo, weather, moon phase, timezone) with caching
  - [x] Unit/integration tests (cache file emission, per-day items, toggles)

### Phase 2 — Aggregates and Badges
- [x] Statistics Calculator plugin (totals, averages, streaks, timeseries)
  - [x] Unit tests (consecutive/non-consecutive, leap day, DST boundaries)
- [x] Badge Engine plugin (Phase 1: streak, spirit, wordcount)
  - [x] Unit tests (thresholds, progress, spirit styling flag)
- [x] Badge Engine plugin (Phase 2: behavior & special — lowest priority)
  - [x] Unit tests (time windows)

### Phase 3 — Visualization
- [x] Heatmap Generator plugin (calendar data, intensity buckets, leap years)
  - [x] Unit tests (range configs, bucket correctness)
- [x] Words-based heatmap shading (0 words = white; higher words = darker)
  - [x] Integration test: `apps/site/tests/heatmapWords.integration.test.ts`
- [x] Heatmap legend (responsive)
  - [x] Integration test: `apps/site/tests/heatmapLegend.integration.test.ts`
- [ ] Theme/UI design system
  - [ ] Colourful gradients (CSS variables)
  - [ ] Serif Google Font (e.g., Literata/Merriweather)
  - [ ] Accessible theme tokens (contrast, reduced motion)
- [x] Templates for dashboard (Nunjucks/Liquid)
  - [x] Stat cards, badge grids (spirit greyscale + 👻 overlay), heatmap
  - [ ] Snapshot tests for templates

### Phase 3.1 — Dashboard polish
- [x] Increase Heatmap heading prominence and spacing
  - [x] Test: `apps/site/tests/heatmapSpacing.integration.test.ts`
- [x] Compact Badge Ideas section (smaller icons/labels, tighter grid, extra separation)
  - [x] Tests: `apps/site/tests/badgeIdeas.integration.test.ts`, spacing assertions in `heatmapSpacing.integration.test.ts`
- [x] Dynamic Badge Ideas unlocking (data-driven)
  - [x] Test: `apps/site/tests/badgeIdeas.integration.test.ts`

### Phase 3.2 — Badges page polish
- [x] Larger badge icons on `/badges/`, section spacing via `.badge-section`
  - [x] Test: `apps/site/tests/badgesPageStyles.integration.test.ts`
- [x] Include Behavior badges on badges page
- [x] Accessible CSS-only tooltips (hover/focus) with `.badge-tip` and `.badge-tipbox`
  - [x] Test: `apps/site/tests/badgesPageTooltips.integration.test.ts`
- [x] Stabilize snapshot-based test by using structural assertions instead
  - [x] Updated: `apps/site/tests/dashboardSnapshot.test.ts`

### Phase 4 — Blog Features
- [x] Taxonomy: tags via Eleventy collections
- [x] Taxonomy: categories via Eleventy collections
  - [x] Tag index pages
  - [x] Category index pages
  - [x] Tests for tags collections and routes
  - [x] Tests for categories collections and routes
- [x] Search: Lunr/Elasticlunr static index (`_data/search-index.json`)
  - [x] Tests for index shape and query behavior
- [x] Tag color script: deterministic unique color per tag with persistence
  - [x] Unit tests for deterministic mapping and collision handling

### Phase 5 — Performance, SEO, Accessibility
- [ ] Caching strategy for external APIs (`.cache/metadata/`) and build step memoization
  - [ ] Benchmarks (target < 30s for 1000+ posts)
- [ ] SEO: sitemap, RSS, meta, JSON-LD
- [ ] Accessibility pass: keyboard navigation, ARIA, focus states
  - [ ] Color contrast tokens for statuses and heatmap
  - [ ] Reduced motion support (`prefers-reduced-motion`)
  - [ ] Visible focus outlines and skip links

### Phase 6 — Docs, CI/CD, Distribution
- [x] Documentation: getting started, testing guide
- [ ] Documentation: configuration, plugin APIs, theming
  - [x] Heatmap thresholds/customization (`docs/heatmap.md`)
  - [ ] Link docs from `README.md` and docs index
- [x] CI: GitHub Actions (required checks)
- [ ] CI: enforce coverage gate (fail build under threshold)
- [ ] CD: deploy previews
- [ ] Distribution: publish plugins to npm scope, release starter theme, versioning strategy

## Open Questions

- Behavior badge signal definitions (edit counts, distraction-free criteria) — deprioritized.
 - Badge Ideas: dynamic unlocking logic and copy — which ideas should promote next steps?

## References

- Requirements: `docs/spec-sheet-short.md`, `docs/spec-badges.md`, `docs/spec-sheet-misc.md`
- This plan is mirrored in our task board and will be updated continuously.
