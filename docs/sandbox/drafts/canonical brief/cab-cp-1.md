## Canonical Architecture Brief — Vibeify (Code‑Enforced View)

### 1. Core Subsystems and Boundaries

1. **Two independent subsystems share a single root `.vibeify` directory:**

   - **Asset System**
     - Controls templates, docs, workflows, and user‑modifiable files.
     - Uses:
       - `.vibeify/assets` — golden, CLI‑managed templates.
       - `vibeify/` — user‑owned editable assets.
     - Enforced by:
       - `vibeify init` behaviour and tests that copy from `.vibeify/assets` into project space and create `vibeify/` content.
       - Makefile `verify` step that requires `dist/assets/.assets-fingerprint` and `dist/assets` to exist.

   - **Prompt Runner System**
     - Controls execution of tasks/prompts.
     - Uses:
       - `.vibeify/runtime/inbox`, `outbox`, `logs`, `cache`.
       - `.vibeify/runtime/install.json`, `.vibeify/runtime/checksums.json`.
     - Enforced by:
       - `init` command calling `initializeRuntimeDir(repoRoot)`.
       - E2E tests asserting existence of `.vibeify/runtime/{inbox,outbox,logs,cache}` and the metadata files.

2. **Subsystem independence (hard separation):**

   - Asset System paths: `.vibeify/assets/*`, `vibeify/*`.
   - Prompt Runner paths: `.vibeify/runtime/*`.
   - Invariants (from spec + tests):
     - Inbox/outbox **never contain template assets**.
     - Inbox/outbox are **not part of the asset update system**.
   - Architectural consequence:
     - Any code that mutates assets (`.vibeify/assets` or `vibeify/`) must not rely on `.vibeify/runtime` contents, and vice versa.
     - Clearing `.vibeify/runtime/*` must not affect asset integrity.

---

### 2. Directory‑Level Invariants

1. **`.vibeify/` — CLI‑managed, non‑user editable**

   - Must contain:
     - `assets/` — pristine template set.
     - `runtime/` with subdirectories: `inbox`, `outbox`, `logs`, `cache`.
     - `runtime/install.json` and `runtime/checksums.json` after `init`.
     - `manifest.json` (manifest specification) under `.vibeify/` in the intended steady state.
   - Creation rules:
     - `vibeify init` **must** ensure `.vibeify/runtime` and all subdirs exist; E2E tests fail otherwise.
   - Update rules:
     - `.vibeify/assets` is updated only by npm or CLI sync logic, not by user edits.
     - Asset content in `.vibeify/assets` must be consistent with the installed CLI version (enforced via manifest/checksums logic, partly via tests and tooling expectations).

2. **`vibeify/` — user‑owned, VCS‑committed**

   - Properties:
     - Files are editable and intended to be committed to version control.
     - Represents the user’s current customization state.
     - Must not be silently overwritten by CLI updates; `init` respects strategies (preserve‑changes/overwrite/skip).
   - Behavioural invariant:
     - `vibeify init`:
       - Creates or populates project‑level assets under `vibeify/` (tests assert e.g. `vibeify/test.md` is materialized).
       - Does **not** overwrite existing `vibeify` content unless `--force` or strategy explicitly allows; edge‑case tests validate `.vibeify` pre‑existence handling.

3. **Manifest and checksum system**

   - `.vibeify/assets` must include a `manifest.yaml` (per README; `init` fails if missing).
   - `.vibeify/runtime/checksums.json`:
     - Records checksums of installed files.
     - Is required for successful `init` completion (tests assert existence).
   - `.vibeify/runtime/install.json`:
     - Records installation metadata and version information.
     - Must be present after `init` (asserted by E2E test and Makefile `verify` analogue for `dist/assets/.assets-fingerprint` on build artifacts).
   - Structural outcome:
     - Any asset‑modifying operation must route through manifest‑driven logic so that checksums/install metadata remain consistent; ad‑hoc writes to `vibeify/` or `.vibeify/assets` outside that pipeline will break drift/audit correctness.

---

### 3. CLI and Execution Flow Constraints

1. **Primary entrypoint and build artifact contract**

   - `bin/vibeify`:
     - At runtime, **must** prefer `dist/vibeify.cjs` if it exists.
     - If `dist/vibeify.cjs` exists:
       - It is executed as a Node binary (`process.execPath` + `dist/vibeify.cjs`).
       - CLI behaviour in production is therefore whatever `dist/vibeify.cjs` implements, not `index.js`.
     - If `dist/vibeify.cjs` is missing:
       - Falls back to dynamic import of `../index.js`.
       - Failure to import `index.js` terminates with non‑zero exit and error log.
   - Makefile `verify` imposes non‑negotiable build outputs:
     - `dist/vibeify.cjs` must exist and be executable.
     - `dist/assets` directory must exist.
     - `dist/assets/.assets-fingerprint` must exist.
   - Consequence:
     - Packaging/build steps must always produce these exact paths; path or name changes require coordinated updates in `bin/vibeify`, Makefile, and any packaging/test tooling.

2. **`vibeify init` command guarantees**

   Postconditions enforced by tests and README:

   - Must:
     - Create `.vibeify/runtime/{inbox,outbox,logs,cache}`.
     - Generate `.vibeify/runtime/install.json` and `.vibeify/runtime/checksums.json`.
     - Use manifest‑driven installation from `.vibeify/assets/manifest.yaml`.
     - Respect per‑file update strategies such as `preserve-changes`, `overwrite`, `skip`.
   - Must not:
     - Run if `manifest.yaml` is missing in `.vibeify/assets` (command fails).
     - Overwrite user customizations in `vibeify/` without respecting strategies or the `--force` flag.
   - Options behaviour:
     - `--force`: bypasses safety prompt and allows overwrites according to strategy rules.
     - `--json`, `--quiet`, `--verbose`: control output format/noise without altering structural effects on the filesystem.

3. **Test harness invariants**

   - `test/cli-e2e.test.js` and `test/init.test.js` assert:
     - Successful CLI exit status for `init` and other core commands.
     - Presence and exact structure of `.vibeify/runtime` directories and metadata files.
     - Materialization of expected files under `vibeify/`.
     - Correct handling when `.vibeify` already exists (no destructive side effects on unknown content).
   - `test-cli.sh` defines a canonical packaging + install flow:
     - A `vibeify-*.tgz` must exist and be discoverable (or `VIBEIFY_TGZ` must point to it).
     - The concrete version string is derived from the tarball filename and used for verification.
     - CLI commands (`help`, `version`, `init`, `status`) must succeed in an isolated npm prefix.
   - Structural implication:
     - Any change to package naming, install location, or CLI exit‑code semantics will break tests and is therefore architecturally constrained.

---

### 4. Asset and Runtime Responsibilities

1. **`/vibeify` (user‑owned assets)**

   - Must be the **only** location for user‑maintained prompts, workflows, onboarding docs, configs, and other project‑specific customizations.
   - Must be safe to commit to VCS.
   - Must be preserved across CLI upgrades; no automatic overwrites from `.vibeify/assets` without explicit user intent.

2. **`.vibeify/assets` (golden templates)**

   - Must be treated as immutable with respect to user edits.
   - Must only be updated via:
     - npm operations (`npm update vibeify-cli`) and/or
     - CLI sync/update commands that are part of the asset system.
   - Must be version‑aligned with the installed CLI; any drift is treated as a state to be detected by `audit`/checksums rather than silently tolerated.

3. **`.vibeify/runtime` (prompt runner engine)**

   - Must contain only runtime artefacts (jobs, results, logs, caches, metadata).
   - May be cleared or rotated without affecting asset integrity.
   - Is the sole source for:
     - Job intake (`inbox`).
     - Result emission (`outbox`).
     - Operational observability (`logs`).
     - Caching of ephemeral computation/state (`cache`).

---

### 5. Command‑Level Architectural Contracts (From Spec, Backed by Behaviour)

Even where not fully implemented, the authoritative spec defines contracts that other code and tests already assume:

1. **`vibeify init`**
   - Creates `/vibeify` from `.vibeify/assets` using manifest‑driven rules.
   - Generates runtime folders under `.vibeify/runtime`.
   - Does not overwrite existing `/vibeify` content unless explicitly forced or allowed by strategy.

2. **`vibeify audit` / `audit --fix` / `audit --apply`**
   - Operate purely on the diff between `/vibeify` and `.vibeify/assets`.
   - Must never treat `.vibeify/runtime/*` as part of the asset set.
   - `audit --fix` must not overwrite files without explicit confirmation/strategy; drift reconciliation must go through manifest + checksums.

3. **`vibeify run`**
   - Consumes jobs exclusively from `.vibeify/runtime/inbox`.
   - Writes results exclusively to `.vibeify/runtime/outbox`.
   - Must not read or modify `.vibeify/assets` or `vibeify/` as part of base execution semantics, except to read configuration that is explicitly designed as runtime‑visible.

---

### 6. Refactoring and Extension Constraints

Any refactor or new feature must preserve these non‑negotiable properties:

1. **Path and directory contracts**:
   - Keep `.vibeify`, `.vibeify/assets`, `.vibeify/runtime`, and `vibeify/` semantics and responsibilities unchanged unless tests, docs, and tooling are updated in lockstep.
   - Preserve the existence and meaning of:
     - `.vibeify/runtime/{inbox,outbox,logs,cache}`.
     - `.vibeify/runtime/install.json`.
     - `.vibeify/runtime/checksums.json`.
     - `dist/vibeify.cjs`, `dist/assets`, `dist/assets/.assets-fingerprint`.

2. **Subsystem separation**:
   - Asset lifecycle (copying, updating, auditing) must remain independent from runtime job processing.
   - Runtime clearing/rotation must never affect templates or user customizations.

3. **Manifest + checksum discipline**:
   - All asset writes that originate from the CLI must be reconciled with manifest/checksums; otherwise `audit` and integrity checks cease to be trustworthy.

4. **CLI entry and packaging behaviour**:
   - `bin/vibeify` must continue to delegate to `dist/vibeify.cjs` when present and maintain the development fallback to `index.js`.
   - Build and publish flows must continue to produce the expected tarball shape and version naming so that `test-cli.sh` and downstream CI remain valid.