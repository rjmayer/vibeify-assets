---
name: SQLite schema & DAO
about: Define local DB schema and data access objects for catches
title: SQLite schema & DAO for catches
labels: area:database, priority:high
assignees: 
---

## Goal
Design and implement a local SQLite schema and minimal DAOs for storing catches offline.

## Tasks
- Define `catches` table (see `docs/concept/mvp.md` for fields).
- Implement basic DAO functions: insertCatch, getCatches, getCatchById, exportCsv.
- Add migration strategy and a simple seed/demo dataset for QA.
- Add unit tests for DAO functions (in-memory SQLite or mocked layer).

## Acceptance criteria
- Local DB stores/retrieves catches correctly.
- Export to CSV works for sample data.
- Tests added and passing.
