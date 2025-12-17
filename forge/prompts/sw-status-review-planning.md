# Software Functionality Status Review — Planning-Ready Agent Instructions

Prompt Version: 1

Objective:
- Perform a comprehensive “Software Functionality Status Review” of the repository’s codebase to determine the actual implemented functionality as of the current date.
- Ignore tests and standalone documentation; assess only code paths that contribute to runtime or exported surfaces.
- Specifically detect code that is unused/inactive or explicitly deprecated.
- Produce a structured Markdown report referencing the date performed and the software version.

Context:
- Date of review: Auto-detect (UTC)
- Software version: Auto-detect from manifest/tags; if not determinable, use “Version: Unknown”.
- Audience: Product and engineering planning.

Scope and Constraints:
- Analyze only production/source code and runtime assets: application entrypoints, modules, functions, classes, routes, CLI commands, configs, manifests, exports, and build/runtime wiring.
- Exclude: tests, fixtures/mocks, example apps, standalone docs, generated files/artifacts.
- Base all findings strictly on code evidence; avoid speculation about intent or roadmap beyond visible implementation.
- Prefer concise, actionable descriptions with file paths and key symbols for traceability.

Methodology (follow step-wise):
1) Version and Entrypoints
- Detect version from: package manifests (e.g., package.json), setup.py/pyproject, VERSION file, build metadata, or annotated tags.
- Identify application entrypoints (main binaries/scripts, server bootstrap files, CLI launchers, package exports).
- Map top-level modules loaded at startup and their primary dependencies; note dynamic imports, plugin registries, and feature flags.

2) Implemented Functionality (Active)
- Enumerate functional domains (APIs, services, business logic, UI components, workflows, background jobs, data models, integrations).
- For each domain:
  - Describe what is implemented and how it is wired (callers, registries, route/component registration, DI containers, schedulers).
  - Provide key files/modules and primary symbols.
  - Note configuration-driven behavior (env vars, build-time flags, runtime toggles) that affects activation.

3) Unused, Idle, or Deprecated Code
- Detect code not referenced by entrypoints or exported surfaces; modules/files with zero inbound references; disabled routes; obsolete adapters; duplicate/shadowed implementations; unreachable code behind permanently false conditions or removed flags.
- Identify explicit deprecation markers (e.g., @deprecated annotations, comments, legacy folders, migration notes).
- Provide evidence per item: reference analysis (no callers/exports), config/bundle exclusion, deprecation comments, or build pipeline omits.

4) Stability, Gaps, and Risks
- Highlight brittle integration points, TODO/FIXME clusters within production code, partial implementations, incomplete migrations, or feature flags stuck in transitional states.
- Call out missing wiring (declared but uninvoked modules, unregistered providers/components, orphan jobs).

Heuristics for “Inactive/Unused” (apply systematically):
- No references from any entrypoint, registry, router, scheduler, DI container, or exported public surface.
- Excluded from build manifests/bundles or gated behind flags that are never set true in configs.
- Located in legacy directories (e.g., /legacy, /old, /v1), or replaced by newer modules with no remaining callers.
- Unmounted UI components, unregistered routes, uninvoked background jobs or workers.
- Libraries included but never instantiated; adapters with no bindings.

Output Format (Markdown):
- Title: “Software Functionality Status Review — {Software Name} — {Detected Version or ‘Version: Unknown’}”
- Metadata:
  - Date: 2025-12-07 (UTC)
  - Repo: {owner/repo if known}
  - Version: {detected or Unknown}
- Section 1: Executive Summary
  - 3–6 bullets summarizing active functionality, major modules, and key gaps.
- Section 2: Active Functionality Map
  - Subsections: APIs, Services, UI, Workflows/Jobs, Data Models, Integrations.
  - For each: implemented behavior, wiring, primary files/modules, and call sites.
- Section 3: Configuration and Feature Flags
  - List env vars, build-time flags, runtime toggles; note active vs dormant flags and their impact.
- Section 4: Deprecated or Inactive Code
  - For each item:
    - Path/Module
    - Status (unused/deprecated/legacy/gated)
    - Evidence (no inbound refs, comments, config exclusion)
    - Suggested action (remove, archive, refactor, verify usage)
- Section 5: Risks and Planning Notes
  - Observations impacting roadmap: partial implementations, brittle integrations, migration debt, feature flag cleanup.
- Appendix A: Entrypoints and Dependency Overview
  - Outline entrypoints and major dependency edges; note dynamic loading or plugin architectures.
- Appendix B: Detection Notes and Limitations
  - Clarify analysis boundaries (e.g., dynamic runtime references, reflection, code generation) and any assumptions.

Reporting Rules:
- Use precise, evidence-based language; avoid speculation.
- Include file paths and key symbols; keep content concise and planning-oriented.
- Do not include or analyze tests or standalone documentation.
- Ensure the metadata (date and version) is present and correct; set “Version: Unknown” if detection fails.

Deliverable:
- A single, clean Markdown report following the above structure, suitable for immediate use in ongoing project planning.