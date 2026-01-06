---
name: Stabilize solunar engine and tests
about: Tasks to finish solunar engine, ensure UTC semantics and unit test coverage
title: Stabilize solunar engine and tests
labels: area:solunar, priority:high
assignees: 
---

## Goal
Stabilize and finalize the solunar engine in `src/solunar/` so its deterministic helpers are well-tested and UTC-safe.

## Tasks
- Review `src/solunar/astro.ts` and finish any TODOs.
- Ensure all time logic uses UTC and add unit tests asserting invariants (e.g. `sunrise < sunset`).
- Add edge-case tests (polar days/nights) and document limitations in code comments.

## Acceptance criteria
- All unit tests pass (`npm run test`).
- CI (GitHub Actions) passes.
- PR includes updated/added tests in `src/solunar/__tests__/`.
