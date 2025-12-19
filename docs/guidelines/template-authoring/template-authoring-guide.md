# Vibeify Template Authoring Guide

This guide explains **how to write prompt templates** in Vibeify.
Templates define **structure**, not execution. They are reusable, versioned, and validated mechanically.

If you follow this guide, your templates will:

* compose cleanly via inheritance
* produce deterministic input schemas
* remain safe to reuse across teams and environments

---

## 1. What a Template Is (and Is Not)

A **prompt template** defines:

* the **sections** of a prompt
* the **placeholders** that must be supplied
* optional inheritance from another template

A template **does not**:

* execute anything
* configure models
* declare defaults
* define lifecycle, governance, or tests
* validate outputs

Templates are **content architecture**, not runtime logic.

---

## 2. File Structure

A template is a single YAML file that conforms to
`prompt-template.schema.v1.json`.

Minimal structure:

```yaml
id: example.template.v1
description: Example template

sections:
  INTRO:
    text: |
      You are an AI assistant.

placeholders:
  OBJECTIVE:
    type: string
    required: true
```

---

## 3. Template Identity

### `id` (required)

* Must be **stable** and **versioned**
* Use dots for namespacing and versioning

Example:

```yaml
id: all-purpose.template.v1
```

Do **not** reuse IDs for incompatible changes.
Create a new version instead.

---

## 4. Inheritance (`extends`)

Templates may extend **one** parent template.

```yaml
extends: all-purpose.template.v1
```

Inheritance is:

* linear
* deterministic
* resolved before execution

Templates must **never assume** inheritance at runtime — inheritance is flattened during resolution.

---

## 5. Sections

Sections define the **visible structure** of the prompt.

### 5.1 Defining a Section

```yaml
sections:
  GOAL:
    text: |
      Your objective is:
      {{OBJECTIVE}}
```

Rules:

* Section names are **free-form but stable**
* Section `text` is static Markdown
* Placeholders must be declared (see Section 6)

---

### 5.2 Overriding a Section

To replace a parent section:

```yaml
sections:
  INTRO:
    override: true
    text: |
      You are a senior backend engineer.
```

This is **explicit** and required.
Silent replacement is not allowed.

---

### 5.3 Removing a Section

To remove an inherited section:

```yaml
sections:
  DEBUG:
    remove: true
```

Removal must be explicit.
If you do nothing, the section is inherited unchanged.

---

## 6. Placeholders

Placeholders declare **all variable content**.

### 6.1 Declaring a Placeholder

```yaml
placeholders:
  OBJECTIVE:
    type: string
    required: true
    description: Primary task to perform
```

Rules:

* Names MUST be `SCREAMING_SNAKE_CASE`
* Every placeholder must be declared
* Undeclared placeholders are forbidden

---

### 6.2 Supported Types

| Type      | Notes                 |
| --------- | --------------------- |
| `string`  | Most common           |
| `number`  | Rare; use sparingly   |
| `boolean` | Feature toggles       |
| `array`   | Requires `items.type` |
| `object`  | Structured input      |

Array example:

```yaml
SUCCESS_CRITERIA:
  type: array
  items:
    type: string
```

---

### 6.3 Required vs Optional

```yaml
required: true   # must be supplied
required: false  # optional
```

* Required placeholders appear in the derived input schema’s `required` list
* Optional placeholders may be omitted or provided via defaults

Templates must **not** declare default values.

---

## 7. Placeholder Redeclaration (Inheritance)

Child templates may redeclare placeholders from parents.

### Allowed:

* making optional → required
* refining descriptions

```yaml
CONSTRAINTS:
  required: true
  description: Mandatory technical constraints
```

### Forbidden:

* changing type incompatibly
* making required → optional
* removing a required placeholder

Violations cause template resolution to fail.

---

## 8. Referencing Placeholders in Text

Placeholders are referenced using double braces:

```text
{{OBJECTIVE}}
```

Rules:

* Every referenced placeholder must be declared
* Unused placeholders are allowed but discouraged
* Renderer-injected values (e.g. timestamps) are not declared here

---

## 9. Defaults (Important Boundary)

Templates **do not contain defaults**.

Defaults live in separate `.defaults.json` files and are merged later.

This separation ensures:

* templates define structure
* defaults encode preferences
* inputs remain overrideable

If you find yourself wanting defaults in a template, stop — you’re in the wrong layer.

---

## 10. What Is Explicitly Forbidden in Templates

Templates must **never** include:

* `promptId`
* `promptClass`
* `lifecycle`
* model or temperature settings
* execution hints
* output schemas
* lint rules
* assertions
* inline context blobs

If it affects *how* or *when* a prompt runs, it does not belong in a template.

---

## 11. Recommended Authoring Pattern

1. Start from `all-purpose`
2. Add structure via sections
3. Declare placeholders early
4. Make everything explicit
5. Prefer small, composable templates
6. Version aggressively, not cleverly

Good templates age well. Clever ones don’t.

---

## 12. Mental Model (Remember This)

> **Templates are to prompts what classes are to objects.**

They define shape and contracts — not behaviour, state, or execution.

If you keep that in mind, everything else stays simple.

---

## 13. Validation & Failure

Before a template can be used, it must:

1. Validate against `prompt-template.schema.v1.json`
2. Resolve inheritance cleanly
3. Produce a single input schema

Failure at any step is a **hard error**.

That’s intentional.

---

## 14. Example (Putting It All Together)

```yaml
id: node-api.template.v1
extends: code-generation.template.v1

sections:
  GOAL:
    override: true
    text: |
      Implement a Node.js API endpoint that:
      {{OBJECTIVE}}

placeholders:
  CONSTRAINTS:
    required: true
    description: Mandatory technical constraints
```

---

## Final Note

If writing a template feels restrictive, that’s a feature — not a bug.
The constraints are what make templates reusable, auditable, and safe.

When in doubt, **add structure, not magic**.


