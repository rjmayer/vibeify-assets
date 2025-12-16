---
name: Insights cache & premium gating
about: Implement local caching and premium gating for AI insights
title: Insights cache & premium gating
labels: area:ai, priority:medium
assignees: 
---

## Goal
Implement local caching for AI-generated insights, a regenerate flow, and gating behind a one-time premium unlock.

## Tasks
- Add caching layer for insights (cache key per user + dataset snapshot + timestamp).
- Implement "Regenerate Insight" action that invalidates cache and requests a fresh summary.
- Wire a premium gate (IAP stub) to enable insights and export features; UI should show upsell for non-premium users.
- Add tests for cache behavior.

## Acceptance criteria
- Insights are cached and displayed when available; regenerate fetches new results.
- Non-premium users see upsell; premium users can fetch insights.
