# Prompt Input Schema v1

This schema defines the allowed **input object** used to render a prompt template.  
It validates only the **content** portion of a prompt definition.  
Execution metadata, identifiers, and lifecycle state are handled in the prompt envelope and **must not appear here**.

## Design principles

- **Validate inputs, not behaviour** – Only ensure that required fields exist and types are correct.
- **Derived from the template** – The schema is generated from placeholder metadata in the template; it is not hand‑written.
- **Use SCREAMING_SNAKE_CASE** for all placeholder keys.
- **Exclude renderer‑injected placeholders** – Values like `TIMESTAMP` are injected by the runtime and therefore omitted from the required list.
- **Backend‑agnostic** – The schema does not assume any specific LLM or platform behaviour.

## Canonical schema

The following JSON Schema (Draft 07) represents `all‑purpose-input.schema.v1.json`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://vibeify.dev/schemas/all-purpose-input.schema.v1.json",
  "title": "Vibeify All‑Purpose Prompt Input Schema v1",
  "description": "Validates the input variables required to render a prompt instance from the all‑purpose prompt template.",
  "type": "object",
  "required": [
    "PROMPT_TITLE",
    "ROLE",
    "OBJECTIVE",
    "SUCCESS_CRITERIA",
    "OUTPUT_SPEC",
    "FINAL_INSTRUCTION"
  ],
  "properties": {
    "PROMPT_TITLE": { "type": "string", "minLength": 1 },
    "PROMPT_DESCRIPTION": { "type": "string" },
    "ROLE": { "type": "string", "minLength": 1 },
    "OPERATING_PRINCIPLES": { "type": "array", "items": { "type": "string" }, "default": [] },
    "REASONING_STYLE": { "type": "string", "default": "Analytical, stepwise reasoning." },
    "REASONING_VISIBILITY": {
      "type": "string",
      "enum": ["hidden","summary","full"],
      "default": "hidden"
    },
    "OBJECTIVE": { "type": "string", "minLength": 1 },
    "SUCCESS_CRITERIA": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Conditions that define when the response is correct."
    },
    "CONTEXT": { "type": "string", "default": "" },
    "CONTEXT_REFERENCES": {
      "type": "array",
      "items": { "type": "string" },
      "default": []
    },
    "TASKS": {
      "type": "array",
      "items": { "type": "string" },
      "default": []
    },
    "CONSTRAINTS": {
      "type": "array",
      "items": { "type": "string" },
      "default": []
    },
    "PREFERENCES": {
      "type": "array",
      "items": { "type": "string" },
      "default": []
    },
    "OUTPUT_SPEC": { "type": "string", "minLength": 1 },
    "FORMATTING_RULES": { "type": "string", "default": "" },
    "OPTIONAL_BEHAVIOUR": {
      "type": "array",
      "items": { "type": "string" },
      "default": []
    },
    "QUALITY_CHECKS": {
      "type": "array",
      "items": { "type": "string" },
      "default": []
    },
    "FINAL_INSTRUCTION": { "type": "string", "minLength": 1 },
    "STRICTNESS_LEVEL": { "type": "string", "default": "medium" },
    "TEMPERATURE_HINTS": { "type": "string", "default": "balanced" },
    "DETERMINISM": { "type": "string", "default": "aim for repeatable outputs" }
  },
  "additionalProperties": false
}
```

Only placeholders defined in the template appear in this schema. Values omitted in a prompt definition may be supplied via defaults.

## Field rationale

- **Required fields** (`PROMPT_TITLE`, `ROLE`, `OBJECTIVE`, `SUCCESS_CRITERIA`, `OUTPUT_SPEC`, `FINAL_INSTRUCTION`) form the minimal contract for a meaningful prompt.
- **Optional fields** such as `OPERATING_PRINCIPLES` and `REASONING_STYLE` provide additional context but are not mandatory.
- Arrays (`OPERATING_PRINCIPLES`, `CONTEXT_REFERENCES`, `TASKS`, `CONSTRAINTS`, `PREFERENCES`, `OPTIONAL_BEHAVIOUR`, `QUALITY_CHECKS`) default to empty arrays.
- Renderer‑injected fields like `TIMESTAMP` are excluded from this schema; they are provided by the runtime, not the prompt author.

## Non‑goals

This schema does **not** encode:

- Execution metadata (`promptId`, `promptClass`, lifecycle state).
- Output structure or correctness.
- Domain or business logic.

Those concerns are handled by separate schemas and artefacts.