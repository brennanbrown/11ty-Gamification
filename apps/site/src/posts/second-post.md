---
title: Testing That Protects Momentum
date: 2025-08-15
tags: [testing, integration, discipline]
---

I’m optimizing for momentum, not perfection. Good tests protect momentum by catching regressions early while staying fast and focused.

Principles I’m following here:

- Start with a failing test that expresses intent.
- Prefer integration tests for user-visible behavior; unit tests for sharply-defined helpers.
- Build hermetically where possible (temp workspaces, UTC normalization) to avoid flakiness.

Tooling choices:

- Vitest: fast, familiar, good DX.
- Eleventy: predictable builds, simple inputs/outputs, easy to test via CLI.

The result is confidence to ship small changes daily and keep the writing streak alive.
