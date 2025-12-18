Prompt outputs need to be validated just like inputs, but the **failure modes are different**.  
The `PromptOutputSchema` defines the **wrapper** around an LLM‑generated result. It validates the shape of this wrapper so that downstream tools (assertions, CI, registries) can reason about execution outcomes without parsing raw LLM output.  
This schema applies to the **execution envelope**, not the template or input.

I’ll give you:

1. **Design constraints (very important here)**
2. **Canonical `prompt-output.schema.v1.json`**
3. **How it is used in practice**
4. **What it deliberately does *not* do**
5. **How this avoids over-constraining creative prompts**

---

## 1. Design constraints for the output wrapper

**PromptOutputSchema v1 MUST:**

* Validate **shape**, not content quality
* Be usable for **machine-checkable assertions**
* Work for **text, markdown, JSON, and code**
* Allow **partial validation**
* Fail *usefully*, not pedantically

**PromptOutputSchema v1 MUST NOT:**

* Encode domain models (DBs, APIs, DTOs)
* Encode stylistic rules (those belong in linting)
* Enforce semantic correctness (“joke is funny”)
* Assume a specific LLM

This schema is about **post-execution sanity**, not perfection.

---

## 2. Canonical `prompt-output.schema.v1.json`

This is a **meta-output schema**: it wraps whatever the model produced in a predictable envelope that tooling can reason about.  
The envelope contains the `promptId` to identify the run, the `promptClass` to declare its risk category, a `status` indicating success or failure, the actual `output`, and optional `warnings`, `errors`, and execution `metadata`.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://vibeify.dev/schemas/prompt-output.schema.v1.json",
  "title": "Vibeify Prompt Output Schema v1",
  "description": "Validates the structured envelope around an LLM-generated prompt output.",
  "type": "object",
  "required": [
    "promptId",
    "promptClass",
    "status",
    "output"
  ],
  "properties": {
    "promptId": {
      "type": "string",
      "description": "The promptId that produced this output."
    },

    "promptClass": {
      "type": "string",
      "description": "Classification of the prompt used during execution.",
      "enum": [
        "trivial",
        "conversational",
        "generative",
        "transformative",
        "destructive"
      ]
    },

    "status": {
      "type": "string",
      "description": "Execution outcome status.",
      "enum": [
        "success",
        "partial",
        "failed"
      ]
    },

    "output": {
      "description": "The primary model output. May be text, markdown, JSON, or code.",
      "oneOf": [
        { "type": "string" },
        { "type": "object" },
        { "type": "array" }
      ]
    },

    "warnings": {
      "type": "array",
      "description": "Non-fatal issues detected during validation or execution.",
      "items": {
        "type": "string"
      },
      "default": []
    },

    "errors": {
      "type": "array",
      "description": "Fatal issues that prevented full success.",
      "items": {
        "type": "string"
      },
      "default": []
    },

    "metadata": {
      "type": "object",
      "description": "Execution metadata and diagnostics.",
      "properties": {
        "model": {
          "type": "string"
        },
        "durationMs": {
          "type": "number"
        },
        "tokensUsed": {
          "type": "number"
        },
        "timestamp": {
          "type": "string",
          "format": "date-time"
        }
      },
      "additionalProperties": true
    }
  },
  "additionalProperties": false
}
```

This schema is intentionally **loose at the core**, strict at the edges.

---

## 3. How this schema is used in practice (important)

### 3.1 The model never sees this schema

This is **post-processing only**.

Flow:

```
Rendered Prompt
   ↓
LLM Response (raw text)
   ↓
vibeify runner
   ↓
Wrap → Validate → Persist
```

---

### 3.2 Example: “tell a joke”

```json
{
  "promptId": "example.tell-joke.v1",
  "promptClass": "trivial",
  "status": "success",
  "output": "Why do programmers hate nature? Too many bugs.",
  "metadata": {
    "model": "gpt-4.1",
    "durationMs": 842,
    "tokensUsed": 37,
    "timestamp": "2025-12-16T21:14:00Z"
  }
}
```

CI can assert:

* `status === success`
* `output` is non-empty

Nothing more. That’s correct.

---

### 3.3 Example: structured output (JSON)

```json
{
  "promptId": "user.create.summary.v1",
  "promptClass": "generative",
  "status": "partial",
  "output": {
    "username": "jdoe",
    "email": "jdoe@example.com"
  },
  "warnings": [
    "Missing optional field: displayName"
  ]
}
```

You can later layer **prompt-specific output schemas** on top of `output`.

---

## 4. What this schema deliberately does NOT do

This is critical — write this down somewhere.

❌ It does **not** validate:

* Code correctness
* JSON field semantics
* API compatibility
* Style or formatting
* Test coverage

Those belong to:

* prompt-specific output schemas
* linters
* test runners
* human review

---

## 5. Avoiding the “LLM straightjacket” problem

This design avoids the classic failure mode of AI tooling:

> “The schema is so strict the model can’t comply.”

Why this works:

* Only the **envelope** is validated
* The actual creative output stays flexible
* Strictness increases *only when you opt in* with additional schemas

This mirrors how HTTP works:

* HTTP defines headers and status codes
* Payload is application-specific

This is the right mental model.

---

## 6. Where this lives (confirming consistency)

As discussed earlier:

```
/vibeify/registry/schemas/prompt-output.schema.v1.json
```

Same lifecycle rules as input schema.

---

## 7. Optional but smart next step

Once this exists, the **very next useful artefact** is:

```
prompt-output.assertions.v1.yaml
```

Example:

```yaml
success:
  - status == "success"
  - output != null
destructive:
  - status != "failed"
  - errors.length == 0
```

That bridges output schema ↔ CI cleanly.

---

If you want next:

* prompt-specific output schemas
* lifecycle metadata schema
* or how lint rules consume `promptClass`

Say which lever you want to pull.
