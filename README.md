# Vibeify Template

This repository defines the **canonical `/vibeify` folder template** used by the Vibeify CLI.

It is **stack‑agnostic** and focuses on:

- Treating **prompts as first‑class source artifacts**
- Providing a **strict but practical schema** for prompts
- Shipping **tests and linters** so prompt quality is CI‑enforced
- Remaining **safe to copy and modify** inside any host project

When the Vibeify CLI initializes a project, it copies the contents of this repo’s `/vibeify` structure into the target repository. After that, the host project owns and freely modifies those files.

---

## Contents

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

---

## Intended Usage

1. **As a template repo**  
   - Click “Use this template” on GitHub, or
   - Clone and copy `/vibeify` into an existing project.

2. **As the source of truth for the Vibeify CLI**  
   The CLI will:
   - Fetch the latest version of this template
   - Copy its `/vibeify` structure into the host project
   - Optionally run `npm test` (prompt tests) as a verification step

3. **As documentation of the Vibe Coding workflow**  
   `registry/onboarding.md` and `registry/styleguide.md` serve as
   the default guidance for any AI agent working inside the project.

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

When copied into a host project, these files are **meant to be edited**:

- `registry/onboarding.md` – replace with your real project onboarding
- `registry/styleguide.md` – customise coding + prompt conventions
- `services/example/**` – replace or extend with real services
- `prompt-tests/**` – add project‑specific scenarios and fixtures

The only strong recommendation is to keep the **overall layout** and
the **core fields in the prompt schema** so tools and CI jobs can
continue to work across projects.

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
