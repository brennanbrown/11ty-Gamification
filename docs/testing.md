# Testing Guide

This project uses Vitest for both unit and integration tests across the monorepo.

- Monorepo root: `package.json` scripts run all tests across `apps/*` and `packages/*`.
- Test runner: Vitest v1.x with Node ESM/CJS compatibility.
- Integration tests for the site invoke Eleventy builds (`npx eleventy`) and inspect generated HTML under `apps/site/_site/`.

## Directory Layout

- `apps/site/tests/` — Integration and unit tests for the site (Eleventy templates, data builders, pages).
- `packages/*/tests/` — Unit tests for shared packages (e.g., tag utilities, content analyzer).

Common site data/build sources referenced by tests:
- `apps/site/src/_data/` — Eleventy data builders (e.g., `activity.js`, `badges.js`, `analyzer.js`).
- `apps/site/src/` — Nunjucks templates (e.g., `index.njk`, `badges.njk`, `_includes/layout.njk`).
- Build output: `apps/site/_site/`.

## Commands

- Run all tests once:

```bash
npm test
```

- Watch mode:

```bash
npm run test:watch
```

- Run a subset by file/glob (Vitest forwards extra args):

```bash
npm test -- apps/site/tests/badges*.test.ts
```

- Filter by test name:

```bash
npm test -- -t "badges data builder"
```

- Coverage (uses `@vitest/coverage-v8`):

```bash
npx vitest --run --coverage
```

Coverage report will output to `coverage/` by default.

## Integration Tests (Eleventy)

Several tests build the site with Eleventy and verify HTML output:
- Example: `apps/site/tests/badgesPage.integration.test.ts`
- Pattern: run `execSync('npx eleventy', { cwd: siteDir })`, then read files under `apps/site/_site/` and assert on markup.

Tips:
- Keep the Eleventy build scoped to `apps/site/` and avoid extra logs (`stdio: 'pipe'`).
- Prefer targeted assertions (headings, links, aria-labels, data attributes) for resilience.

## Adding Tests

- Place tests next to the area they cover:
  - Site-level features → `apps/site/tests/`
  - Shared package logic → `packages/<pkg>/tests/`
- Name files with `.test.ts` and keep them small and focused.
- For new pages or data builders, add:
  - Unit tests for data shape and edge cases.
  - Integration tests that render/build and assert on HTML.

## CI

- GitHub Actions workflow: `.github/workflows/ci.yml` runs lint, typecheck, and `npm test` on pushes/PRs.
- Ensure tests are deterministic (no reliance on system locale/timezone without mocking). Integration tests that depend on dates should prefer fixed inputs.

## Troubleshooting

- Eleventy build failures: run `npx eleventy` inside `apps/site/` to reproduce, then re-run the affected integration test.
- Flakiness around dates: mock date or explicitly compute UTC dates in tests.
- Tailwind lint warnings may surface in editors but do not affect tests; they can be ignored during test runs.

## Conventions

- Prefer explicit logic in Nunjucks (avoid ternary quirks). Compute denominators and percentages step-by-step.
- Tag selectors and `data-*` attributes (e.g., `data-heatmap="calendar"`) help target UI elements in tests.
- Always add tests for new features per project policy.
