# Vibeify Assets

This repository defines the **canonical `/vibeify` folder template** used by the Vibeify CLI.

It is **stack‑agnostic** and focuses on:

- Treating **prompts as first‑class source artifacts**
- Providing a **strict but practical schema** for prompts
- Shipping **tests and linters** so prompt quality is CI‑enforced
- Remaining **safe to copy and modify** inside any host project

When the Vibeify CLI initializes a project, it copies the contents of this repo’s `/vibeify` structure into the target repository. After that, the host project owns and freely modifies those files as appropriate (within the boundaries set by the repo manifest, see below).

---

## Documentation

Comprehensive documentation is available in the **[`docs/`](docs/)** directory, organized into:

- **[Architecture](docs/)** - Design concepts and high-level architecture
- **[Guides](docs/)** - Getting started, template authoring, and contribution guidelines
- **[Reference](docs/)** - Technical specifications, schemas, and algorithms
- **[Sandbox](docs/)** - Experimental features and work-in-progress materials

See the **[Documentation Index](docs/README.md)** for a complete navigation guide.

---

## Template Manifest

The definitive source of truth for which files belong in this template, and how they are managed, is the **[`manifest.yaml`](manifest.yaml)** file in the root of this repository. _**All installation, update, and sync behavior for template files is governed by the manifest.**_

### Manifest Structure

```yaml
version: 1

files:
  - source: registry/onboarding.md           # Path in template repo
    target: vibeify/registry/onboarding.md   # Path in user project
    user_editable: true                      # Can users modify this file?
    update_strategy: preserve-changes        # How to handle updates
    description: "General project context"   # Human-readable description
    when:                                    # Optional conditional logic
      env: github
```

Only files explicitly listed in `manifest.yaml` are considered part of the template. File presence in the repository **does not automatically mean it will be installed or updated**—the manifest is authoritative.

### FileEntry Fields

| Field             | Required | Default            | Description                                                             |
|-------------------|----------|--------------------|-------------------------------------------------------------------------|
| `source`          | Yes      | —                  | Relative path to the file in this template repository                    |
| `target`          | Yes      | —                  | Where the file should be placed in the user's project                    |
| `user_editable`   | No       | `true`             | If `false`, CLI treats file as managed and may overwrite                 |
| `update_strategy` | No       | `preserve-changes` | How updates behave (see below)                                           |
| `description`     | No       | —                  | Human-readable documentation                                             |
| `when`            | No       | —                  | Conditional installation rules (future-ready)                            |

Whenever the README and manifest conflict, **the manifest is always correct**.

### Update Strategies

| Strategy           | Behavior                                                                            |
|--------------------|-------------------------------------------------------------------------------------|
| `preserve-changes` | Never overwrite user-changed files; mark drift during audit                         |
| `overwrite`        | Always replace local file with template version                                      |
| `skip`             | Ignore this file during updates and installs                                         |
| `merge-attempt`    | Reserved for future — attempt 3-way merge                                            |

### Validation

The manifest is validated against `manifest.schema.json`. Run validation with:

```bash
npm run validate:manifest
```

### Generating a Baseline Manifest

To generate a new manifest from the repository structure (the manifest will control installation):

```bash
npm run generate:manifest           # Writes to manifest.yaml
npm run generate:manifest -- --dry-run  # Preview without writing
```

---

## Template Contents

_**Refer directly to `manifest.yaml` for the authoritative list of files and their mappings. The content structure below is a convenience summary only.**_

```text
/registry
  onboarding.md            ← default AI onboarding doc (project‑level)
  styleguide.md            ← prompt & context style rules
  api-specs/               ← placeholder for OpenAPI / API docs
  prompt-schema.json       ← JSON Schema describing prompt YAML structure

/services
  /example
    prompts/
      create_user.yaml     ← example “create user” prompt
      list_users.yaml      ← example “list users” prompt
    context/
      db-schema.yaml       ← example relational schema context

/prompt-tests
  test_runner.js           ← validates all prompts against schema + lints
  fixtures/
    sample_issue.json      ← example issue payload from an ALM system

/tools
  prompt-linter.js         ← style / consistency checks for prompts
  prompt-cli.js            ← simple runner that assembles prompt + context

/inbox                     ← raw, unstructured prompt drafts (empty)
/outbox                    ← AI outputs (empty)

.github/workflows/prompt-tests.yml  ← CI job to run prompt tests
package.json                          ← Node dependencies & scripts
```

Notes:
- Not every file above may be copied or managed by default—**the official inclusion and update behavior is set by `manifest.yaml`.**
- Some files may exist in the repo but be excluded from installs; see the manifest for their status.

---

## Intended Usage

### 1. As a template repo
- Click “Use this template” on GitHub, or
- Clone and copy `/vibeify` into an existing project.
- When installing/copying, **always consult the manifest to understand which files will be included and update behavior.**

### 2. As the source of truth for the Vibeify CLI
The CLI:
- Fetches the latest version of this template
- Reads the manifest for the list of files, paths, user-editable flags, and update strategies
- Copies files accordingly into the host project
- Optionally runs `npm test` (prompt tests) as a verification step

### 3. As documentation of the Vibe Coding workflow
`registry/onboarding.md` and `registry/styleguide.md` serve as
the default guidance for any AI agent working inside the project (as included by the manifest).

---

## Prompt Schema

All prompts under `services/**/prompts/*.yaml` must conform to the
JSON Schema in `registry/prompt-schema.json`.

High‑level structure:

```yaml
id: string                      # unique id, e.g. user.create.v1
name: string                    # human‑readable name
description: string             # clear explanation of purpose
service: string                 # logical service name (e.g. user-service)
version: string                 # semantic version of the prompt

tags:                           # free‑form tags
  - user
  - http
  - create

inputs:
  arguments:                    # formal inputs the agent should expect
    - name: user_payload
      type: object
      description: Raw user payload from API request
      required: true
  examples:                     # sample input payloads
    - name: minimal_example
      description: Minimal valid user payload
      payload:
        user_payload:
          email: "alice@example.com"
          name: "Alice"

context:
  files:                        # relative paths under /vibeify
    - services/example/context/db-schema.yaml
  inline:                       # small inline context blocks
    business_rules:
      - Emails must be unique per user.
      - Passwords must never be logged.

instructions:
  steps:
    - Validate the input against the business rules and schema.
    - Generate code or pseudo‑code in the host tech stack to implement this.
    - Describe any edge cases and error handling.
  model_preferences:
    temperature: 0.2
    max_tokens: 1200

output:
  format: markdown
  schema:
    description: >
      The response must be a markdown document with two sections: "Implementation"
      and "Notes". Implementation contains code or structured pseudo‑code, Notes
      explains design decisions and trade‑offs.

tests:
  cases:
    - name: basic_payload
      input_ref: minimal_example
      assertions:
        must_contain:
          - "Implementation"
          - "Notes"
```

The **test runner** and **linter** both assume this schema. Projects are free to extend it, but the base fields should remain stable where possible.

> **Schemas that define “what a prompt is” live in /registry/schemas.**
> **Schemas that define “what a prompt does” live next to the prompt.**

---

## Running Prompt Tests Locally

Requirements:

- Node.js ≥ 18
- npm

Install dependencies:

```bash
npm install
```

Run the prompt test suite:

```bash
npm test
```

This will:

1. Load `registry/prompt-schema.json`
2. Find all `services/**/prompts/*.yaml`
3. Parse them via `js-yaml`
4. Validate them against the JSON Schema using `ajv`
5. Run a set of lint rules (see `tools/prompt-linter.js`)

If any prompt fails schema validation or lint checks, the process exits with a non‑zero status code.

---

## GitHub Actions (CI)

The workflow in `.github/workflows/prompt-tests.yml` runs on every
push and pull request:

- Checks out the repo
- Sets up Node
- Installs dependencies with `npm ci`
- Runs `npm test`

This ensures any change to prompts or schema cannot be merged
without passing automated checks.

---

## Modifying the Template

When copied into a host project, **editability is governed by the `user_editable` flag in `manifest.yaml`**:

- Files marked `user_editable: true` (e.g. `registry/onboarding.md`, `registry/styleguide.md`) are meant to be customized by users in downstream projects.
- Files marked `user_editable: false` are managed by the template and may be overwritten or require sync.
- The **manifest** is always the source of truth for which files are intended for modification.

The only strong recommendation is to keep the **overall layout** and the **core fields in the prompt schema** so tools and CI jobs can continue to work across projects.

---

## Versioning

The template is versioned via `package.json` and, if desired,
Git tags (e.g. `v1.0.0`, `v1.1.0`).

The `registry/prompt-schema.json` has its own `schema_version`
field which should be bumped whenever **breaking changes** are made
to the prompt structure.

---

## License

You can adapt this template freely within your own projects. Add a license file here that matches your desired usage model (e.g. MIT, Apache‑2.0).

---
**Note:**  
_If there is ever disagreement or ambiguity between this README and the [`manifest.yaml`](manifest.yaml), the manifest is the canonical truth for included files and update policy._
