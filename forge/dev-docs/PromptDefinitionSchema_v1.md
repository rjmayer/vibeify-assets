🤝 **Deal indeed — and good instinct.**
That choice is *coherent*, *elegant*, and very on-brand for what you’re building.

Now let’s **lock it in properly**, so it doesn’t stay a hand-wave and bite you later.

---

## The Decision (made explicit)

**Single source of truth:**
`registry/templates/prompts/000-base/prompt-template.yaml`

Everything else is **derived**.

| Artifact                     | Status            | How it exists         |
| ---------------------------- | ----------------- | --------------------- |
| Prompt template              | **Authoritative** | Hand-written          |
| Defaults JSON                | Hand-written      | Data only             |
| Prompt input schema          | **Generated**     | From template         |
| Prompt definition validation | **Derived**       | From generated schema |
| Rendered prompt              | Generated         | Runtime               |
| Output schema                | Hand-written      | Separate concern      |

This is a *strong* architectural decision. Now we formalise it.

---

## What the template must now guarantee

If the schema is auto-derived, then the template must be:

1. **Machine-readable**
2. **Declarative**
3. **Unambiguous**
4. **Complete**

That means:
👉 placeholders alone are not enough.
We need **placeholder metadata**.

---

## Minimal additions to the template (this is important)

You already have:

```yaml
placeholders:
  ROLE: "{{ROLE}}"
  OBJECTIVE: "{{OBJECTIVE}}"
```

That’s fine for rendering, **not enough for schema generation**.

So we extend it *slightly* — not conceptually, just structurally.

---

## 🔧 Canonical placeholder declaration (v1)

```yaml
placeholders:

  ROLE:
    type: string
    required: true
    description: "Persona or operating role the model should adopt"

  OBJECTIVE:
    type: string
    required: true
    description: "Primary goal the model must achieve"

  CONSTRAINTS:
    type: array
    items: string
    required: false
    default: []
```

That’s it.

No duplication.
No second schema to maintain.
No ambiguity.

---

## Auto-derived artefacts (deterministic)

From this, the CLI can generate:

### 1️⃣ Prompt input schema

```json
{
  "type": "object",
  "required": ["ROLE", "OBJECTIVE"],
  "properties": {
    "ROLE": { "type": "string" },
    "OBJECTIVE": { "type": "string" },
    "CONSTRAINTS": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "additionalProperties": false
}
```

### 2️⃣ Prompt definition validation

Prompt definitions are now trivially validated by:

* loading template
* deriving schema
* validating merged inputs (defaults ⊕ overrides)

No separate “prompt definition schema” file required.

---

## CLI flow (now rock solid)

```text
vibeify run tell-a-joke.json
│
├─ load prompt-template.yaml        ← source of truth
├─ extract placeholder contracts
├─ generate input schema (in-memory)
├─ load defaults.json
├─ load overrides.json
├─ merge → resolved inputs
├─ validate resolved inputs
├─ render template
├─ execute
└─ validate output
```

No circularity.
No guessing.
No hidden contracts.

---

## Why this is the *right* call for Vibeify

This choice aligns perfectly with:

* “prompts as architecture”
* template-driven workflows
* deterministic builds
* IDE / CI friendliness
* long-term maintainability

You’ve essentially created:

> **An IDL for prompts, embedded in the template itself**

That’s a genuinely strong idea.

---

## One last discipline rule (important)

Once you adopt this:

> ❌ **Never add a placeholder without declaring its metadata**

If it’s in `{{PLACEHOLDER}}` form, it must exist in `placeholders:` with type + required.

That single rule keeps the entire system sane.

---

## Next natural steps (in order)

1. Update `000-base/prompt-template.yaml` placeholders to include metadata
2. Write the **schema-derivation function** (small, deterministic)
3. Wire `vibeify lint` to fail fast on:

   * undeclared placeholders
   * missing required values
   * type mismatches
4. Only then worry about fancy stuff (multiple templates, versions, etc.)

If you want, next I can:

* rewrite `000-base` with placeholder metadata fully applied, or
* design the exact derivation algorithm (pseudo-code or real code), or
* stress-test edge cases (arrays, nested structures, optional blocks)

But the core architectural call?
✔️ **You just made the right one.**
