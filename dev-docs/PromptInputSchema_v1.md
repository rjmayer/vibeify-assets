Below is a **canonical `PromptInputSchema v1`**, deliberately opinionated, minimal, and extensible. It is **not** trying to encode prompt structure or domain knowledge — only *what must exist for a prompt instance to be valid before rendering*.

I’ll give you:

1. **Design principles (short, important)**
2. **The actual schema (JSON Schema, draft-07 compatible)**
3. **Field-by-field rationale**
4. **Explicit non-goals (to prevent future misuse)**

---

# 1. Design principles (lock these in)

**PromptInputSchema v1 MUST:**

* Validate **inputs**, not behaviour
* Be **template-agnostic**
* Be **LLM-backend-agnostic**
* Support **trivial → destructive** prompts
* Stay stable for a long time

**PromptInputSchema v1 MUST NOT:**

* Encode prompt layers (Instruction/Goal/etc.)
* Encode domain schemas (DB, API, business logic)
* Encode output structure
* Encode lifecycle or execution metadata

If you violate these later, you should bump the version.

---

# 2. Canonical PromptInputSchema v1

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://vibeify.dev/schemas/prompt-input.schema.v1.json",
  "title": "Vibeify Prompt Input Schema v1",
  "description": "Validates the input variables required to render a prompt instance from a prompt template.",
  "type": "object",
  "required": [
    "promptId",
    "promptClass",
    "objective"
  ],
  "properties": {
    "promptId": {
      "type": "string",
      "description": "Unique identifier for this prompt instance (stable across executions).",
      "minLength": 1
    },

    "promptClass": {
      "type": "string",
      "description": "Semantic class of the prompt, used to drive linting, policy, and execution rules.",
      "enum": [
        "trivial",
        "conversational",
        "generative",
        "transformative",
        "destructive"
      ]
    },

    "objective": {
      "type": "string",
      "description": "The primary goal the model must achieve. This is always mandatory.",
      "minLength": 1
    },

    "role": {
      "type": "string",
      "description": "Persona or operating role the model should adopt.",
      "default": "A helpful and knowledgeable AI assistant"
    },

    "constraints": {
      "type": "array",
      "description": "Hard rules the model must follow.",
      "items": {
        "type": "string",
        "minLength": 1
      },
      "default": []
    },

    "successCriteria": {
      "type": "array",
      "description": "Conditions that define when the response is considered correct.",
      "items": {
        "type": "string",
        "minLength": 1
      },
      "default": []
    },

    "contextReferences": {
      "type": "array",
      "description": "Paths or identifiers of external context files to be injected into the prompt.",
      "items": {
        "type": "string",
        "minLength": 1
      },
      "default": []
    },

    "outputFormat": {
      "type": "string",
      "description": "Declared format of the expected output.",
      "enum": [
        "markdown",
        "json",
        "code",
        "text"
      ],
      "default": "markdown"
    },

    "reasoningVisibility": {
      "type": "string",
      "description": "Controls whether the model should expose its reasoning.",
      "enum": [
        "hidden",
        "summary",
        "full"
      ],
      "default": "hidden"
    },

    "tone": {
      "type": "string",
      "description": "Desired tone of the response.",
      "default": "neutral"
    },

    "verbosity": {
      "type": "string",
      "description": "Desired verbosity level of the response.",
      "enum": [
        "concise",
        "balanced",
        "verbose"
      ],
      "default": "balanced"
    },

    "language": {
      "type": "string",
      "description": "Language the response should be written in.",
      "default": "en"
    }
  },

  "additionalProperties": false
}
```

This is intentionally boring — boring here is *good*.

---

# 3. Field-by-field rationale (why each exists)

### `promptId` (required)

* Identity anchor for:

  * audit trails
  * registry indexing
  * CI references
* Must be stable across executions

---

### `promptClass` (required)

This is the **most important field after `objective`**.

It unlocks:

* class-specific lint rules
* different CI strictness
* future execution safeguards

Without this, all prompts become “equal”, which is false.

---

### `objective` (required)

You already spotted this earlier — you were right.

If this is missing:

* the prompt is meaningless
* the schema should fail hard

---

### `role`

Defaults are fine here.
This is a **soft default**, not policy.

---

### `constraints`

These are **hard instructions**, not preferences.

Linting can later:

* flag vague constraints
* enforce minimum constraints for destructive prompts

---

### `successCriteria`

This is gold for:

* prompt tests
* regression detection
* CI assertions

You’ll thank yourself later for making this first-class.

---

### `contextReferences`

Crucially:

* references only
* not embedded content

This keeps prompt input clean and composable.

---

### `outputFormat`

This is *not* the output schema.

It’s just a **declaration** that downstream tooling can react to.

---

### `reasoningVisibility`

You already intuitively separated this earlier.

This field:

* enables policy defaults
* allows enterprise-safe enforcement

---

### `tone`, `verbosity`, `language`

These are deliberately **soft control knobs**:

* easy to override
* easy to ignore by stricter prompt classes

---

# 4. Explicit non-goals (write these down somewhere)

PromptInputSchema v1 **does NOT**:

* Define prompt layout
* Enforce Instruction/Goal/Context sections
* Validate model output
* Encode execution settings (model, temperature, tokens)
* Encode lifecycle state
* Encode Jira or ticket metadata

Those are all **different schemas**.

---

# 5. How this fits your “tell a joke” example

Your joke prompt would pass with:

```json
{
  "promptId": "example.tell-joke.v1",
  "promptClass": "trivial",
  "objective": "Tell a joke",
  "outputFormat": "text"
}
```

Everything else is defaults — which is *exactly* what you want.

---

## Final sanity check

If you freeze **this** as v1 and promise yourself:

> “Any new need requires a new schema, not mutation of this one”

…then you’ve laid a genuinely professional foundation.

If you want next:

* `PromptOutputSchema v1`
* `PromptLifecycleMetadata v1`
* or a **lint ruleset keyed off `promptClass`**

Say the word.
