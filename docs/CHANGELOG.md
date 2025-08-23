# Changelog

All notable changes will be documented in this file. This project follows a testing-first workflow; each entry references tests where applicable.

## [Unreleased]

## [2025-08-23]

### Added
- Badges page enhancements (`apps/site/src/badges.njk`):
  - Larger badge icons on `/badges/` with section spacing via `.badge-section` wrappers.
  - Behavior badges displayed alongside Streak/Spirit/Word Count.
  - Accessible CSS-only tooltips that reveal on hover/focus, using `.badge-tip` and `.badge-tipbox`.
- Tests:
  - `apps/site/tests/badgesPageTooltips.integration.test.ts` verifies tooltip markup and data attributes.
  - `apps/site/tests/badgesPageStyles.integration.test.ts` asserts large badge styles and grayscale spirit badges.

### Changed
- Snapshot test stabilization: `apps/site/tests/dashboardSnapshot.test.ts` now uses structural assertions instead of snapshots to avoid flakiness.
- Documentation: Added "Snapshot guidance" in `README.md` recommending structural assertions for dynamic sections.

### Fixed
- Replaced a JS-driven tooltip (which caused build/test instability) with a CSS-only implementation.

### Tests
- Full suite green: 40 files, 69 tests passing.

### Added
- Evergreen posts:
  - `badge-engine-overview.md` (badges, architecture)
  - `writing-workflow.md` (process, writing)
  - `tagging-strategy.md` (tags, organization)
- Default post layout for all posts via directory data file `apps/site/src/posts/posts.json`.
- Tests:
  - `apps/site/tests/postsDefaults.test.ts` verifies `post.njk` is applied by default to posts.
  - `apps/site/tests/siteBuild.integration.test.ts` updated to assert new post and tag pages exist.
- Project planning and architecture documented in `docs/TODO.md`.
- Testing-first process adopted (unit/integration/E2E), coverage thresholds to be enforced in CI.
- Clarifications applied: Plant/Growth emoji badge theme, global features enabled by default, behavior/special badges set to lowest priority.
- Monorepo scaffolding initiated:
  - Root workspaces, `tsconfig.base.json`, `vitest.config.ts`.
  - Created `packages/content-analyzer` with TypeScript source and unit tests.
  - Created Eleventy app skeleton `apps/site/` with `.eleventy.js` and package script stubs.
- Integrated Tailwind CSS in `apps/site/`:
  - `tailwind.config.cjs` with gradients, serif font, and typography plugin.
  - `postcss.config.cjs` and `src/assets/tailwind.css` compiled to `src/assets/styles.css`.
- Added realistic Markdown fixtures for tests:
  - `packages/content-analyzer/tests/fixtures/post-simple.md` (headings, lists, unicode, fenced code).
  - Referenced in `packages/content-analyzer/tests/index.test.ts`.
- Deterministic tag color utilities and tests:
  - `packages/site-utils/src/tagColors.ts` with tests in `packages/site-utils/tests/tagColors.test.ts`.
  - Eleventy filters `tagColor` and `tagTextColor` wired in `apps/site/.eleventy.js`.
- Tags collection utilities and tests:
  - `packages/site-utils/src/tags.ts` with tests in `packages/site-utils/tests/tags.test.ts`.
  - Eleventy data builders: `apps/site/src/_data/tagsList.js` and `apps/site/src/_data/tagMap.js`.
- Tags pages:
  - Tags index `apps/site/src/tags.njk`.
  - Sample post `apps/site/src/posts/hello-world.md`.
- Client-side search:
  - Index builder `apps/site/src/_data/searchIndex.js`.
  - Search JSON `apps/site/src/search.json.njk` and UI `apps/site/src/search.njk`.
- Analyzer and dashboard stats:
  - Data builder `apps/site/src/_data/analyzer.js` (uses content-analyzer with fallback).
  - Dashboard renders totals and per-post table in `apps/site/src/index.njk`.
- Activity (streak + heatmap):
  - Data builder `apps/site/src/_data/activity.js`.
  - Dashboard renders streak badge and heatmap in `apps/site/src/index.njk`.
  - Calendar-style heatmap on dashboard with weekday/month labels and clickable days linking to per-day pages (`apps/site/src/index.njk`).
  - Per-day pages at `/days/YYYY-MM-DD/` listing posts for the date (`apps/site/src/days/day.njk`).
  - Full month calendar pages with navigation: `/calendar/YYYY-MM/` with Prev/Next links and index alias at `/calendar/` (`apps/site/src/calendar/month.njk`, `apps/site/src/calendar/index.njk`).
  - UTC-based date normalization and filesystem fallback in `apps/site/src/_data/activity.js` to prevent timezone drift and ensure calendar-page generation.
- Dashboard heatmap now shades by per-day word count instead of number of posts.
  - 0 words = white; more words = darker green buckets (≈0.2/0.4/0.6/0.8 opacity).
  - Day tooltips show `YYYY-MM-DD: N words`.
- Dashboard layout polish:
  - Increased spacing and prominence for Heatmap heading.
  - Made Badge Ideas section more compact with extra separation.
- CI workflow:
  - GitHub Actions `/.github/workflows/ci.yml` runs install, tests (Vitest), and site build on push/PR to `main`.

### Planned (Next)
- Wire CI skeleton (lint/test/build) and coverage thresholds.
  - Coverage gates already enforced by Vitest config; extend CI to report coverage artifacts if desired.
- Implement deterministic tag color mapping (unique per tag) and pages for tags/categories with Tailwind Typography.
- Client-side search: build `search.json` and minimal UI.

### Notes
- Behavior badges (e.g., distraction-free) may require additional signals; deprioritized to Phase 2.

### Fixed
- Content Analyzer improvements (`packages/content-analyzer/src/index.ts`), validated by `packages/content-analyzer/tests/index.test.ts`:
  - Preserve leading newline after YAML frontmatter removal.
  - Ignore fenced and inline code reliably for word counts.
  - Treat decimal numbers (e.g., `2.0`) as single tokens.

### Tests
- All unit tests pass:
  - `packages/content-analyzer/tests/index.test.ts`
  - `packages/site-utils/tests/tagColors.test.ts`
  - `packages/site-utils/tests/tags.test.ts`
  - `packages/site-utils/tests/pills.test.ts`
  - `apps/site/tests/tagsData.test.ts`
  - `apps/site/tests/searchIndex.test.ts`
  - `apps/site/tests/analyzerData.test.ts`
  - `apps/site/tests/activityData.test.ts`
  - `apps/site/tests/heatmapDays.integration.test.ts`
  - `apps/site/tests/heatmapMonthNav.integration.test.ts`
  - `apps/site/tests/heatmapSpacing.integration.test.ts` (Heatmap header classes, Badge Ideas spacing)
  - `apps/site/tests/heatmapWords.integration.test.ts` (words-based shading)
  - `apps/site/tests/badgeIdeas.integration.test.ts` (ideas grid + titles)
  - `apps/site/tests/badges.integration.test.ts` updated to allow additional classes on Heatmap header
  - `apps/site/tests/postsDefaults.test.ts`
