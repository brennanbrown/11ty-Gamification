---
title: Badge Engine Overview
date: 2025-08-17
tags: [badges, architecture]
---

A quick tour of how streak, spirit, and word-count badges are computed. The data builders aggregate activity and analyzer signals, then map thresholds to emoji. Simplicity first: predictable inputs, deterministic thresholds, and clear UI labels.

Notes:

- Streak: consecutive-day activity with UTC normalization.
- Spirit: total active days, independent of streak.
- Word count: cumulative site word totals.

Future: weekly goals and topic streaks layered on this foundation.
