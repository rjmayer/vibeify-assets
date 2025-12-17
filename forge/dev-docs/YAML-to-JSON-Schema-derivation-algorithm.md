Below is the **exact derivation algorithm**, deliberately written so it can be:

* implemented verbatim in Node or Python
* reasoned about in CI
* documented as part of Vibeify’s architecture

No hand-waving, no magic.

---

# YAML → JSON Schema derivation algorithm

*(from `prompt-template.yaml` → prompt input schema)*

## Scope

This algorithm derives a **JSON Schema for prompt inputs** from **one prompt template**.

**Authoritative source:**

```
registry/templates/prompts/000-base/prompt-template.yaml
```

Specifically:

```
placeholders:
  <PLACEHOLDER_NAME>:
    type: ...
    required: ...
    default: ...
    items: ...
    format: ...
```

---

## Definitions

### Inputs

* `TEMPLATE` – parsed YAML object
* `PLACEHOLDERS` = `TEMPLATE.placeholders`

### Outputs

* `SCHEMA` – JSON Schema (Draft 07 is fine)

---

## High-level steps

```
1. Extract placeholder metadata
2. Validate placeholder declarations
3. Build JSON Schema properties
4. Build required[] list
5. Set additionalProperties = false
6. Emit schema
```

Each step is deterministic.

---

## Step 1 — Extract placeholder metadata

```pseudo
placeholders = TEMPLATE.placeholders

assert placeholders is an object
assert placeholders has at least one entry
```

Each placeholder entry MUST be an object.

Fail fast if this is not true.

---

## Step 2 — Validate placeholder declarations (template lint)

For each placeholder `P` in `placeholders`:

```pseudo
assert P.type exists
assert P.type in ["string", "array", "number", "boolean", "object"]
```

If `P.type == "array"`:

```pseudo
assert P.items exists
assert P.items == "string" OR is a valid schema fragment
```

If `P.required` is missing:

```pseudo
P.required = false
```

If `P.default` exists:

```pseudo
assert type(P.default) matches P.type
```

❗ **Important rule**
If any placeholder violates this, **template is invalid** → stop.

---

## Step 3 — Build `properties` section

Initialize:

```pseudo
schema.properties = {}
```

For each placeholder `P`:

### 3.1 Base schema node

```pseudo
node = {}
node.type = P.type
```

### 3.2 Handle arrays

If `P.type == "array"`:

```pseudo
node.items = { "type": P.items }
```

(If later you allow nested schemas, this becomes recursive.)

### 3.3 Optional metadata

If `P.format` exists:

```pseudo
node.format = P.format
```

If `P.description` exists:

```pseudo
node.description = P.description
```

If `P.default` exists:

```pseudo
node.default = P.default
```

### 3.4 Attach node

```pseudo
schema.properties[PLACEHOLDER_NAME] = node
```

---

## Step 4 — Build `required` list

Initialize:

```pseudo
schema.required = []
```

For each placeholder `P`:

```pseudo
if P.required == true AND P.injectedBy != "renderer":
    schema.required.push(PLACEHOLDER_NAME)
```

### Renderer-injected rule

You already discovered this implicitly:

Examples:

* `TIMESTAMP`
* future: `EXECUTION_ID`, `MODEL_NAME`

These **must not** be required from user input.

So you formalise it:

```yaml
TIMESTAMP:
  type: string
  format: date-time
  required: true
  injectedBy: renderer
```

Algorithm rule:

```pseudo
if P.injectedBy == "renderer":
    do NOT include in required[]
```

---

## Step 5 — Lock schema strictly

Always add:

```pseudo
schema.additionalProperties = false
```

Why:

* prevents silent typos
* enforces template contract
* enables strict CI linting

---

## Step 6 — Final schema envelope

Wrap with standard JSON Schema fields:

```pseudo
schema.$schema = "http://json-schema.org/draft-07/schema#"
schema.title = "Vibeify Prompt Input Schema (derived)"
schema.description = "Auto-derived from prompt-template.yaml"
schema.type = "object"
```

---

## Final output (example)

From your current `000-base`, this produces (schematically):

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Vibeify Prompt Input Schema (derived)",
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
    "PROMPT_TITLE": { "type": "string" },
    "PROMPT_DESCRIPTION": { "type": "string" },
    "ROLE": { "type": "string" },
    "OBJECTIVE": { "type": "string" },
    "SUCCESS_CRITERIA": {
      "type": "array",
      "items": { "type": "string" }
    },
    ...
  },
  "additionalProperties": false
}
```

---

## Invariants this guarantees

Once implemented, the following statements are *provably true*:

1. Every valid prompt definition matches the template
2. No undeclared placeholder can sneak in
3. No required intent can be omitted
4. Defaults + overrides are always merge-safe
5. Template edits automatically update validation

This is **exactly** what “template as IDL” means in concrete terms.

---

## Edge cases (explicitly handled)

| Case                                 | Outcome                |
| ------------------------------------ | ---------------------- |
| Placeholder added, no defaults       | Valid                  |
| Placeholder required, default = null | Forces override        |
| Renderer-only placeholder            | Excluded from required |
| Unknown key in prompt JSON           | Validation error       |
| Type mismatch                        | Validation error       |

---

## Implementation note (pragmatic)

This derivation is ~50–70 LOC in Node or Python.

No dependency on:

* JSON Schema generators
* reflection
* runtime prompt rendering

It can run:

* at CLI startup
* in `vibeify lint`
* in CI
* in IDE plugins

---

## Final sanity check

What you have now is:

> **A prompt template that is simultaneously:**
>
> * documentation
> * renderer
> * interface definition
> * validation source

And the schema is just a *compiled artefact*.

That’s a very strong architectural position — and now it’s no longer hand-wavy, it’s executable.

If you want next, I can:

* write the actual Node implementation
* or add versioning rules (`000-base` → `001-base`)
* or stress-test this against weird prompts

But the derivation itself?
This is the exact, final algorithm.
