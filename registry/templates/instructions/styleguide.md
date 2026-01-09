# Vibeify Styleguide

This document defines **how prompts and context should be written** in this project.

It is deliberately short and opinionated. Extend it as needed.

---

## 1. General Principles

- **Be explicit, not clever.** Prompts should read like good specifications,
  not like magic incantations.
- **Prefer structure over prose.** Use structured YAML fields instead of
  long free‑form paragraphs wherever possible.
- **One responsibility per prompt.** Each prompt should do one well‑defined thing.
- **AI is a collaborator, not a magician.** Make assumptions and constraints
  explicit so outputs are reproducible.

---

## 2. File & Naming Conventions

- Prompt files live under:  
  `vibeify/services/<service-name>/prompts/*.yaml`
- Context files live under:  
  `vibeify/services/<service-name>/context/*`
- Services are named in **kebab‑case**, e.g.:
  - `user-service`
  - `billing-service`
  - `analytics-reports`
- Prompt IDs follow the pattern:

  ```text
  <service>.<action>.<version>
  ```

  Examples:

  - `user.create.v1`
  - `user.list.v1`
  - `billing.invoice-generate.v2`

- File names should mirror the main action, e.g.:
  - `create_user.yaml`
  - `list_users.yaml`
  - `generate_invoice.yaml`

---

## 3. YAML Conventions

- Keys are `snake_case` or `kebab-case` (choose one and stick to it).
- Indentation: **2 spaces**, no tabs.
- No trailing whitespace.
- Use double quotes only when needed (e.g. strings with `:` or `#`).

Example snippet:

```yaml
id: user.create.v1
name: Create User Endpoint
description: >
  Generate implementation and documentation for creating a user in the
  current backend stack.
```

---

## 4. Writing Good Descriptions & Instructions

### Descriptions

- Must be **one to three sentences**.
- Describe **what** the prompt does, not how the AI works.
- Avoid placeholders like “TBD”, “TODO”, “fix later”.

### Instructions

- Use step‑wise instructions under `instructions.steps`.
- Each step describes a concrete operation, e.g.:

  ```yaml
  instructions:
    steps:
      - Validate the input payload against the constraints in the context.
      - Generate code or structured pseudo‑code in the host tech stack.
      - Include unit tests or example usage, if applicable.
  ```

- Refer to context explicitly ("using the schema in `db-schema.yaml`") so
  humans can trace where requirements come from.

---

## 5. Context Files

- Keep context files:
  - Small and focused (e.g. one schema or one business ruleset per file).
  - Written in formats that are easy to diff (YAML, JSON, Markdown).
- Avoid duplicating the same rules across multiple context files; reference 
  shared files instead.
- Document the **source of truth** for any given rule (e.g. “copied from
  `docs/user-requirements.md` on 2025‑11‑01”).

Example `db-schema.yaml` fragment:

```yaml
version: 1
entities:
  user:
    table: users
    columns:
      id:
        type: uuid
        primary_key: true
      email:
        type: varchar(255)
        unique: true
      name:
        type: varchar(255)
      created_at:
        type: timestamp
        default: now()
```

---

## 6. Tests & Lint Rules

The prompt tests and linter enforce a minimal baseline of quality:

- Every prompt must conform to `prompt-schema.json`.
- `description` must be present and non‑empty.
- At least one `instructions.steps` entry must be defined.
- Deprecated placeholders (“TBD”, “TODO”, “… later”) are not allowed.

You can add additional rules in `tools/prompt-linter.js` to capture your
team’s best practices.

---

## 7. Tone of Voice (for AI Outputs)

- Default: **clear, professional, neutral**.
- Prefer explaining *why* something is done a certain way when it is not obvious.
- Avoid informal language unless explicitly requested in the prompt.
- For code‑related outputs, prioritise correctness and clarity over brevity.
