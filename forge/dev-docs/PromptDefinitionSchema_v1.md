# Prompt Definition Schema v1

A **prompt definition** describes how to construct and run a prompt instance in the Vibeify system.  
It binds a template to concrete inputs and optionally references default values.  
It does **not** include execution metadata such as lifecycle state, model settings, or identifiers—those belong to the **execution envelope**.

## Design Goals

- **Composition** – A definition composes three things: a template, a set of defaults, and a content input object.
- **Separation of concerns** – Execution metadata (e.g. `promptId`, `promptClass`, lifecycle state) belongs in the prompt envelope, not in the definition itself.
- **Template‑driven** – The set of valid inputs is derived from the template’s placeholder metadata; the schema is generated rather than hand‑written.

## Core artifacts

| Artifact | Role |
| --- | --- |
| **Template (`prompt-template.yaml`)** | Single source of truth for rendering. Defines placeholders and their metadata. |
| **Defaults (`all-purpose.defaults.v1.json`)** | Optional baseline values for placeholders. Provides opinionated starting points but no structure. |
| **Input schema (`all-purpose-input.schema.v1.json`)** | Auto‑derived from the template. Validates the `input` portion of a definition. |

## Definition Format

A prompt definition is a small YAML or JSON file that references the template and defaults, and provides an `input` object. The `input` object is validated against the derived input schema; placeholders with defaults may be omitted.

Example definition:

```yaml
templateRef: registry/templates/all-purpose/prompt-template.yaml
defaultsRef: registry/templates/all-purpose/all-purpose.defaults.v1.json
input:
  OBJECTIVE: "Tell a joke"
  SUCCESS_CRITERIA:
    - "The response is arguably funny"
    - "The response is complete"
    - "The response follows the required output format"
```

## Relationships

- **Rendering** – The CLI loads the template, merges defaults with the provided input (overrides take precedence), validates the merged input against the derived schema, and then renders the template.
- **Execution envelope** – When the definition is executed, it is wrapped in an envelope that adds `promptId`, `promptClass`, lifecycle metadata, and execution settings. This wrapper is responsible for governance and observability. The definition focuses solely on content inputs.

This approach ensures that content and governance remain decoupled while still allowing templates to evolve deterministically.