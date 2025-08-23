# Heatmap (Words-Based Shading)

This dashboard heatmap visualizes writing activity by total words per day. Inactive days are white; higher word counts produce darker green cells.

## Overview
- Data source: `apps/site/src/_data/activity.js` provides `calendarWeeks` with `day.words` per date.
- Rendering: `apps/site/src/index.njk` computes an RGBA background per day from the word count.
- Tests: `apps/site/tests/heatmapWords.integration.test.ts` asserts white for zero-word days and correct bucket shading.

## Current thresholds
Defined in `apps/site/src/index.njk` in the heatmap block:

- 0 words → `#ffffff` (white)
- 1–199 → `rgba(16,185,129, 0.2)`
- 200–499 → `rgba(16,185,129, 0.4)`
- 500–999 → `rgba(16,185,129, 0.6)`
- 1000+ → `rgba(16,185,129, 0.8)`

Snippet (for reference):

```njk
{% set w = day.words or 0 %}
{% set bg = '#ffffff' %}
{% if w > 0 %}
  {% set opacity = 0.2 %}
  {% if w >= 200 and w < 500 %}
    {% set opacity = 0.4 %}
  {% elif w >= 500 and w < 1000 %}
    {% set opacity = 0.6 %}
  {% elif w >= 1000 %}
    {% set opacity = 0.8 %}
  {% endif %}
  {% set bg = 'rgba(16,185,129,' ~ opacity ~ ')' %}
{% endif %}
```

## How to customize
1. Edit `apps/site/src/index.njk` within the heatmap section (`<section> … Heatmap … </section>`), around the `w = day.words` logic.
2. Adjust the bucket boundaries and `opacity` values to your preference.
3. If you change bucket edges, update or extend tests accordingly (see below).

Tip: keep 0 words as white for clear “no-activity” semantics.

## Tests to update when changing buckets
- `apps/site/tests/heatmapWords.integration.test.ts`
  - Verifies zero-word white background and presence of green RGBA cells.
  - Extend with specific boundary assertions if you refine buckets.
- Optional: add dedicated boundary tests (e.g., days with exactly 200, 500, 1000 words) to ensure the correct opacity.

## Accessibility
- Titles use the format `YYYY-MM-DD: N words` and muted styling for non-current-month days.
- Consider adding a textual legend or tabular alternative for screen-reader users if you change colors.
