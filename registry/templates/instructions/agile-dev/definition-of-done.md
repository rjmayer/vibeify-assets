# Definition of Done (DoD) — Issues / Pull Requests

This document describes a typical Scrum-style Definition of Done used for completing issues, PRs, and releases in this repository. Use this checklist to decide whether an issue / PR is ready to merge and release.

## ✅ Acceptance Criteria (must be met)

- The issue's requested functionality is implemented and matches the issue description or acceptance tests.
- All related user-visible behavior has been verified by the author (manual quick-check where appropriate).
- Any new public API, exported function, or data shape is documented (inline + README/docs) and examples updated.

## 🧪 Tests & Quality

- Unit tests added for new behavior (happy path + at least one edge case) where applicable.
- Existing tests pass locally and in CI.
- Type-checking succeeds (no ts errors for TypeScript projects).
- Linting passes or any new warnings are explicitly justified in the PR description.

## 🔁 Build & CI

- The project builds successfully (no broken imports or compile errors).
- CI workflows (tests, typecheck, lint) complete successfully for the PR branch.

## 🔎 Review & Collaboration

- The PR has a clear description of what changed and why, with screenshots or sample output when UI/UX is affected.
- At least one code review approval from a team member (or the repository's configured number of reviewers) is present.
- Review comments are addressed (code updated or rationale documented).

## 📦 Release & Deployment Considerations

- If DB schema or persisted data format changed, migration steps are included and backward compatibility is considered.
- Feature flags or toggles are used for risky or incomplete features as appropriate.
- Release notes / changelog entry added if the change is user-facing.

## 🧰 Housekeeping

- No credentials, secrets, or large binary files committed.
- Sensitive fields are not logged or uploaded.
- TODOs left in code are acceptable only for tracked follow-ups documented in the issue tracker (not silent TODOs).

## ⚠️ Exceptions

- Small docs-only PRs may skip tests when it's unreasonable, but must still pass lint/type checks.
- Prototype experiments must be marked clearly and documented; they may be merged into experimental branches only.

---

When in doubt, prefer small, testable, and well-documented changes. If a change is large or risky, break it into smaller PRs that each satisfy this DoD.
