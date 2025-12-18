# Prompt Definition Schema v1

This document defines the **Prompt Definition** artifact in Vibeify. It is the canonical, machine‑enforced contract that describes how a prompt definition is structured and what it is allowed to contain.

A prompt definition binds **content** to a **template**. It deliberately excludes execution, governance, and policy concerns.

---

## 1. Purpose

The Prompt Definition exists to:

* Bind a prompt template to concrete **content inputs**
* Optionally reference a **defaults** file for baseline values
* Remain stable and reusable across environments

It does **not**:

* Declare execution metadata (IDs, classes, lifecycle)
* Configure models or temperatures
* Define output validation or assertions
* Contain tests or CI logic

Those concerns live in separate, explicitly defined layers.

---

## 2. Position in the Architecture

The Prompt Definition sits between **templates** and **execution envelopes**.

```
Prompt Template
      ↓
Prompt Definition  ← this document
      ↓
Execution Envelope
      ↓
LLM Execution
```

This separation ensures that:

* Prompt content can evolve independently of governance
* The same definition can be reused in local runs, CI, or different backends
* Tooling can enforce boundaries deterministically

---

## 3. What a Prompt Definition Contains

A Prompt Definition contains exactly three conceptual elements:

1. **Template Reference** – which template defines the structure
2. **Defaults Reference (optional)** – baseline values for optional placeholders
3. **Input Object** – concrete content values supplied by the author

Nothing else is permitted.

---

## 4. Canonical Schema

The Prompt Definition is validated by a dedicated JSON Schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://vibeify.dev/schemas/prompt-definition.schema.v1.json",
  "title": "Vibeify Prompt Definition Schema v1",
  "description": "Defines a prompt definition that binds a template to content inputs. Execution metadata, lifecycle, model configuration, and governance are explicitly excluded.",
  "type": "object",
  "required": [
    "templateRef",
    "input"
  ],
  "properties": {
    "templateRef": {
      "type": "string",
      "minLength": 1,
      "description": "Path or identifier of the prompt template used to render this definition."
    },
    "defaultsRef": {
      "type": "string",
      "description": "Optional reference to a defaults file providing baseline values for optional placeholders."
    },
    "input": {
      "type": "object",
      "description": "Content inputs for the template. This object is validated separately against the input schema derived from the referenced template."
    }
  },
  "additionalProperties": false
}
```

The final line (`additionalProperties: false`) is critical. It ensures that no execution or governance fields can leak into content definitions.

---

## 5. Relationship to the Input Schema

The Prompt Definition schema **does not** validate the internal structure of the `input` object.

Instead:

* The referenced template defines placeholders and their metadata
* An **input schema** is derived automatically from the template
* The runtime validates the merged input (defaults + overrides) against that derived schema

This keeps the Prompt Definition schema template‑agnostic and future‑proof.

---

## 6. What Is Explicitly Forbidden

The following must never appear in a Prompt Definition:

* `promptId`
* `promptClass`
* `lifecycle`
* `execution`
* model configuration (temperature, tokens, backend)
* tests or assertions
* output schemas or validation rules

If any of these are present, the definition is invalid by schema and must be rejected.

---

## 7. Example Prompt Definition

```json
{
  "templateRef": "registry/templates/all-purpose/prompt-template.yaml",
  "defaultsRef": "registry/templates/all-purpose/all-purpose.defaults.v1.json",
  "input": {
    "OBJECTIVE": "Tell a boring joke",
    "SUCCESS_CRITERIA": [
      "The response is arguably funny",
      "The response is complete"
    ]
  }
}
```

This file contains only content. All execution‑time concerns are added later by the runner.

---

## 8. Enforcement

The CLI must validate every prompt definition against `prompt-definition.schema.v1.json` **before**:

* merging defaults
* validating input schemas
* linting
* execution

This guarantees that architectural boundaries are enforced mechanically rather than socially.

---

## 9. Versioning

Any backward‑incompatible change to the structure of a prompt definition requires:

* a new schema version (`v2`)
* an updated `$id`
* explicit migration rules

Prompt Definitions themselves should be versioned independently from templates and lifecycle state.

---

## 10. Summary

The Prompt Definition is intentionally boring.

Its power comes from what it *refuses* to contain.

By constraining prompt definitions to content only, Vibeify enables:

* deterministic validation
* clean governance
* scalable prompt reuse
* future expansion without architectural drift

This document is the authoritative reference for that contract.
