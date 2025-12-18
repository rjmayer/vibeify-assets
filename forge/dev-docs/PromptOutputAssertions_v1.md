This is the missing **glue layer** between *schemas* and *CI*, and it’s exactly where a lot of systems fall apart if they don’t do it explicitly.

1. **What this file is (and is not)**
2. **Canonical `prompt-output.assertions.v1.yaml`**
3. **Assertion semantics (so it’s not hand-wavy)**
4. **How `promptClass` maps into this cleanly**
5. **How this plugs into CI and local runs**

---

## 1. What this file *is*

`prompt-output.assertions.v1.yaml` defines **machine‑evaluable rules** that determine whether an LLM execution is acceptable. These rules operate on the **output envelope**—the structured wrapper around raw LLM output—rather than on the text itself. The envelope is the thing produced by the runner after it wraps, validates, and annotates raw output.

* acceptable
* degraded-but-usable
* unacceptable

It operates **after**:

* prompt execution
* output wrapping
* output schema validation

Think of it as:

> *Unit tests for AI output envelopes*

---

## 2. What this file is *not*

It is **not**:

* an output schema
* a linter
* a style guide
* a semantic validator (“is the joke funny?”)

Those are separate layers by design.

---

## 3. Canonical `prompt-output.assertions.v1.yaml`

This is deliberately minimal, explicit, and composable.

```yaml
version: 1

description: >
  Canonical assertion rules for validating prompt outputs based on promptClass.
  These rules are evaluated after output schema validation and before outputs
  are accepted into the registry or CI pipeline.

engine:
  language: js-expression
  context: prompt-output-envelope

defaults:
  onFailure: fail
  severity: error

assertions:

  global:
    - id: output_present
      description: Output must be present
      when: true
      assert: output != null

    - id: status_valid
      description: Status must be one of the defined values
      when: true
      assert: ["success", "partial", "failed"].includes(status)

  trivial:
    - id: trivial_no_errors
      description: Trivial prompts must not fail fatally
      when: promptClass == "trivial"
      assert: status != "failed"

  conversational:
    - id: conversational_output_non_empty
      description: Conversational prompts must produce non-empty output
      when: promptClass == "conversational"
      assert: typeof output === "string" && output.trim().length > 0

  generative:
    - id: generative_success_or_partial
      description: Generative prompts may be partial but not failed
      when: promptClass == "generative"
      assert: status == "success" || status == "partial"

  transformative:
    - id: transformative_success_only
      description: Transformative prompts must succeed
      when: promptClass == "transformative"
      assert: status == "success"

  destructive:
    - id: destructive_strict_success
      description: Destructive prompts require full success and zero errors
      when: promptClass == "destructive"
      assert: status == "success" && errors.length == 0
```

This is intentionally boring, explicit, and enforceable.

---

## 4. Assertion semantics (important – don’t hand-wave this)

### Execution context

Each assertion runs with access to:

```js
{
  promptId,
  promptClass,
  status,
  output,
  warnings,
  errors,
  metadata
}
```

No magic. No hidden state.

---

### `when`

* A boolean expression
* If false → assertion is skipped
* If true → assertion must pass

---

### `assert`

* Evaluated as a JavaScript expression
* Must return truthy
* If false → assertion fails

---

### Failure behaviour

By default:

* any failed assertion → execution fails
* CI job fails
* output is not promoted

You *can* later add:

```yaml
severity: warning
onFailure: continue
```

—but **not in v1**. Keep it strict.

---

## 5. How `promptClass` cleanly drives rigor

This file is where your earlier architectural decision pays off.

| promptClass    | Allowed Outcome          |
| -------------- | ------------------------ |
| trivial        | success / partial        |
| conversational | success only (non-empty) |
| generative     | success / partial        |
| transformative | success only             |
| destructive    | success + zero errors    |

That’s a **policy surface**, not prompt logic.

You can now change policy **without touching prompts**.

---

## 6. Where this file lives (lock it in)

Consistent with earlier decisions:

```
/vibeify/registry/assertions/
  prompt-output.assertions.v1.yaml
```

Registry again, because:

* applies to all prompts
* versioned
* shared contract

---

## 7. How this plugs into CLI & CI (concrete)

### CLI flow

```
vibeify run prompt.yaml
  → execute LLM
  → wrap output
  → validate against prompt-output.schema.v1.json
  → evaluate prompt-output.assertions.v1.yaml
  → write to /outbox or fail
```

---

### CI flow

```
for each output in /vibeify/outbox:
  validate schema
  evaluate assertions
  fail pipeline if any assertion fails
```

This gives you **deterministic, reviewable AI behaviour** — which is rare, and valuable.

---

## 8. One deliberate omission (and why)

There is **no reference to model, temperature, tokens, etc.** here.

That belongs to:

* execution config
* observability
* cost controls

Not correctness.

---

## 9. Sanity check using your “tell a joke” prompt

```yaml
promptClass: trivial
status: success
output: "Why do programmers..."
errors: []
```

✔ passes
✔ no over-constraint
✔ no special casing

Exactly what you want.

---

### Where to go next (logical sequence)

You now have:

1. PromptInputSchema v1
2. PromptOutputSchema v1
3. PromptOutputAssertions v1

The **next most valuable artefact** is either:

* `prompt-lifecycle.schema.v1.json`
* or `prompt-lint.rules.v1.yaml`

If you want momentum: I’d do lifecycle next.
