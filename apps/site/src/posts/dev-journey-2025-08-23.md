---
title: Dev Journey — Badges UI, Tooltips, and Test Stabilization
date: 2025-08-23
tags: [development, badges, accessibility]
layout: post.njk
---

Today’s focus was on polishing the badges page and hardening our tests:

- Enlarged badge icons on the `/badges/` page for better legibility.
- Displayed behavior badges alongside existing Streak, Spirit, and Word Count.
- Implemented accessible, CSS-only tooltips that show on hover/focus (no JS required on the page).
- Replaced a flaky snapshot test with explicit structural assertions.
- Added integration tests to verify tooltip markup and large-badge styling.

Why CSS-only tooltips? Simpler, more resilient, and still keyboard-accessible with `:focus-within`. This eliminated build-time instability seen with a previous page-level script.

What’s next:

- Consider subtle animations/arrow for tooltips.
- Extract tooltip styles into a shared partial if we reuse them elsewhere.
- Monitor mobile ergonomics and adjust spacing if needed.
