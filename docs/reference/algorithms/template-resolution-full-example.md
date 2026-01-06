# Worked Example — Template Resolution & Inheritance

This example demonstrates:

* multi-level inheritance
* placeholder strengthening
* section override
* section inheritance
* deterministic flattening
* schema derivation

---

## 1️⃣ Base Template — `all-purpose.template.yaml`

```yaml
id: all-purpose.template.v1
description: Canonical base template for general prompts

sections:
  INTRO:
    text: |
      You are an AI assistant.

  GOAL:
    text: |
      Your objective is:
      {{OBJECTIVE}}

  OUTPUT:
    text: |
      Produce output that satisfies:
      {{SUCCESS_CRITERIA}}

placeholders:
  OBJECTIVE:
    type: string
    required: true
    description: Primary task to perform

  SUCCESS_CRITERIA:
    type: array
    items: string
    required: true
    description: Conditions for correctness
```

**Notes**

* No inheritance
* No defaults
* No execution metadata
* Fully valid standalone template

---

## 2️⃣ Specialised Template — `code-generation.template.yaml`

```yaml
id: code-generation.template.v1
extends: all-purpose.template.v1
description: Base template for code generation prompts

sections:
  INTRO:
    override: true
    text: |
      You are a senior software engineer.

  CONSTRAINTS:
    text: |
      Follow these constraints:
      {{CONSTRAINTS}}

placeholders:
  CONSTRAINTS:
    type: array
    items: string
    required: false
    description: Technical constraints to obey
```

**What this does**

* Overrides `INTRO`
* Inherits `GOAL` and `OUTPUT`
* Adds new placeholder `CONSTRAINTS`

---

## 3️⃣ Domain Template — `node-api.template.yaml`

```yaml
id: node-api.template.v1
extends: code-generation.template.v1
description: Template for Node.js API endpoints

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

**What this does**

* Overrides `GOAL`
* Strengthens `CONSTRAINTS` from optional → required
* Does **not** touch type (array of strings)

✔️ This is a **legal redeclaration**

---

## 4️⃣ Resolution Order (Normative)

Resolution chain:

```
all-purpose
→ code-generation
→ node-api
```

Applied **top to bottom**, base first, most specific last.

---

## 5️⃣ Fully Resolved Template — `node-api.resolved.template.yaml`

This is the **only artifact downstream systems see**.

```yaml
id: node-api.template.v1
description: Template for Node.js API endpoints

sections:
  INTRO:
    text: |
      You are a senior software engineer.

  GOAL:
    text: |
      Implement a Node.js API endpoint that:
      {{OBJECTIVE}}

  OUTPUT:
    text: |
      Produce output that satisfies:
      {{SUCCESS_CRITERIA}}

  CONSTRAINTS:
    text: |
      Follow these constraints:
      {{CONSTRAINTS}}

placeholders:
  OBJECTIVE:
    type: string
    required: true
    description: Primary task to perform

  SUCCESS_CRITERIA:
    type: array
    items: string
    required: true
    description: Conditions for correctness

  CONSTRAINTS:
    type: array
    items: string
    required: true
    description: Mandatory technical constraints
```

✔️ No `extends`
✔️ No inheritance metadata
✔️ Deterministic
✔️ Standalone

---

## 6️⃣ Derived Input Schema — `node-api-input.schema.v1.json`

Generated **only after resolution**.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://vibeify.dev/schemas/node-api-input.schema.v1.json",
  "title": "Node API Prompt Input Schema v1",
  "type": "object",
  "required": [
    "OBJECTIVE",
    "SUCCESS_CRITERIA",
    "CONSTRAINTS"
  ],
  "properties": {
    "OBJECTIVE": {
      "type": "string",
      "minLength": 1
    },
    "SUCCESS_CRITERIA": {
      "type": "array",
      "items": { "type": "string" }
    },
    "CONSTRAINTS": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "additionalProperties": false
}
```

✔️ `CONSTRAINTS` is required
✔️ No inheritance artifacts
✔️ No hidden inputs

---

## 7️⃣ Example Prompt Definition (Content-Only)

```yaml
templateRef: registry/templates/node-api.template.v1.yaml
input:
  OBJECTIVE: "Create a REST endpoint for listing users"
  SUCCESS_CRITERIA:
    - "Endpoint responds with HTTP 200"
    - "Response is valid JSON"
  CONSTRAINTS:
    - "Use Express.js"
    - "Do not use any ORM"
```

✔️ Valid by schema
✔️ CLI overrides work
✔️ No awareness of inheritance

---

## 8️⃣ Conformance Tests Covered

This single example exercises:

| Test                        | Covered |
| --------------------------- | ------- |
| A2 Two-level inheritance    | ✅       |
| D1 Placeholder inheritance  | ✅       |
| D2 Constraint strengthening | ✅       |
| E2 Section override         | ✅       |
| E4 Section inheritance      | ✅       |
| F1 Schema derivation        | ✅       |
| H1 Flattening guarantee     | ✅       |
| H2 Standalone equivalence   | ✅       |

This makes it an ideal **golden fixture**.

