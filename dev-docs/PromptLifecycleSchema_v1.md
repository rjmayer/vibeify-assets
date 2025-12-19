Prompts in vibeify carry lifecycle metadata to control when they may be run, trusted, or evolved. Lifecycle sits in the execution envelope—not in the prompt template or the input schema—and it governs behaviour across local runs, CI pipelines, and registries.

This document explains:

1. Why lifecycle exists and how it differs from workflows or ticketing.
2. The canonical `prompt-lifecycle.schema.v1.json` used to validate lifecycle metadata.
3. What each lifecycle status means in practice.
4. How lifecycle is enforced by the CLI and CI.
5. What is intentionally out of scope for v1.

## 1. Purpose of lifecycle (governance vs workflow)

Lifecycle answers three questions about a prompt definition:

- **Can this prompt be executed?** In other words, should the runner allow execution in local or CI contexts?
- **Can its output be trusted?** Are the results eligible to be promoted into registries or consumed by downstream systems?
- **Can this definition evolve?** Are edits allowed without bumping versions?

It is attached to the *execution envelope*. The renderer and the input schema know nothing about lifecycle. Lifecycle metadata enforces governance around using a prompt; it is not a workflow engine, a ticket system, or a release process.

Think of lifecycle as akin to branch protection rules for prompts.

## 2. Canonical schema (validation contract)

The lifecycle object is validated by a dedicated JSON Schema. This schema is small, strict, and versioned independently of the input schema.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://vibeify.dev/schemas/prompt-lifecycle.schema.v1.json",
  "title": "Vibeify Prompt Lifecycle Schema v1",
  "description": "Defines the lifecycle state and governance metadata for a prompt.",
  "type": "object",
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "type": "string",
      "description": "Current lifecycle status of the prompt.",
      "enum": [
        "draft",
        "review",
        "approved",
        "deprecated",
        "archived"
      ]
    },
    "reviewedBy": {
      "type": "array",
      "description": "Actors who have reviewed this prompt.",
      "items": {
        "type": "string",
        "enum": [
          "human",
          "ai"
        ]
      },
      "default": []
    },
    "approvedBy": {
      "type": "string",
      "description": "Identifier of the human or system that approved this prompt.",
      "minLength": 1
    },
    "lastReviewedAt": {
      "type": "string",
      "description": "ISO timestamp of the most recent review.",
      "format": "date-time"
    },
    "lastApprovedAt": {
      "type": "string",
      "description": "ISO timestamp of approval.",
      "format": "date-time"
    },
    "supersedes": {
      "type": "string",
      "description": "PromptId of the prompt version this one replaces."
    },
    "notes": {
      "type": "string",
      "description": "Optional human-readable notes about lifecycle decisions."
    }
  },
  "additionalProperties": false
}
```

Place this file at `/vibeify/registry/schemas/prompt-lifecycle.schema.v1.json` and reference it from each execution envelope under the `lifecycle` field.

## 3. Status semantics (how each status behaves)

Lifecycle is meaningful only if the semantics of each status are clear and enforced. Adopt these rules in the runner and CI:

### `draft`

- Editable without version bumps.
- Executable only in local development.
- Outputs are never promoted.
- Must not be run in CI.

Use this for experimentation, WIP, and prompts still being refined.

### `review`

- Editable without version bumps.
- Executable locally and in CI, but CI must not block on its results.
- Outputs are marked non-authoritative.

Use for peer review, AI-assisted review, and dry runs in pipelines.

### `approved`

- Changes require version bumps.
- Executable everywhere.
- CI treats failures as blocking.
- Outputs are promotable to registries.

This is the default “production” status.

### `deprecated`

- No new executions allowed in CI.
- Local execution allowed with warning.
- Must reference a successor via `supersedes`.

Use when replacing a prompt with a newer version and during migration periods.

### `archived`

- Not executable.
- Not editable.
- Retained only for audit/compliance.

Use to retain history when a prompt is no longer needed.

## 4. Enforcement behaviour

The lifecycle metadata is enforced in two places:

- **CLI (`vibeify run`)** – decides whether a local run is permitted and prints warnings.
- **CI** – determines whether a pipeline should fail. CI must fail if the lifecycle status is invalid, not `approved`, or if assertions fail.

A simple enforcement table:

| Status     | Allowed in local run | Allowed in CI | Promotable |
|-----------|----------------------|---------------|-----------|
| draft      | ✅ (warn)             | ❌            | ❌         |
| review     | ✅ (warn)             | ✅ (non-blocking) | ⚠️ non-authoritative |
| approved   | ✅                    | ✅             | ✅        |
| deprecated | ⚠️ (warn)             | ❌            | ❌         |
| archived   | ❌                    | ❌             | ❌         |

Do not embed lifecycle logic in prompt templates. Keep it in the runner and CI.

## 5. Out of scope for v1

Lifecycle v1 deliberately does **not** include:

- Jira or ticket IDs.
- Git commit hashes.
- Owners or teams.
- Risk classifications.
- Change history.

Those might be useful later, but including them now would blur the boundary between governance and workflow. Keep v1 focused on permission and trust.

With this, the core governance triangle—inputs, outputs, lifecycle—is complete, and you can enforce correct usage without polluting prompt content.