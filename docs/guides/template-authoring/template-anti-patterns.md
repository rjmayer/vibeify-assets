# Vibeify Template Anti-Patterns

This document lists **common mistakes** when authoring prompt templates in Vibeify, explains **why they are harmful**, and shows the **correct pattern**.

If you recognise any of these in existing templates, treat them as **technical debt**.

---

## 1. Smuggling Execution Logic into Templates

### ❌ Anti-Pattern

```yaml
promptClass: generative
model: gpt-4
temperature: 0.7
```

### Why this is wrong

Templates are **content architecture only**.
Execution logic belongs in the **execution envelope**, not in the template.

If templates know about models or temperatures:

* they become environment-specific
* reuse breaks immediately
* governance cannot evolve independently

### ✅ Correct Pattern

```yaml
# Template contains only structure and placeholders
sections:
  GOAL:
    text: |
      {{OBJECTIVE}}
```

Execution configuration is applied later by the runner.

---

## 2. Hidden Domain Parameters (a.k.a. “Just One Little Knob”)

### ❌ Anti-Pattern

```yaml
sections:
  INTRO:
    text: |
      Write this in a humorous tone for a {{AUDIENCE}} audience.
```

…but `AUDIENCE` is **not declared** anywhere.

### Why this is wrong

This recreates the exact problem Vibeify exists to eliminate:

* undeclared inputs
* invisible variability
* no schema
* no validation
* no CLI override safety

### ✅ Correct Pattern

```yaml
placeholders:
  AUDIENCE:
    type: string
    required: false
    description: Intended audience

sections:
  INTRO:
    text: |
      Write this for a {{AUDIENCE}} audience.
```

If it’s variable, it must be declared.

---

## 3. Embedding Defaults in Templates

### ❌ Anti-Pattern

```yaml
placeholders:
  TONE:
    type: string
    default: professional
```

### Why this is wrong

Defaults are **policy**, not structure.

Embedding defaults:

* makes templates opinionated
* blocks reuse
* breaks override semantics
* blurs template vs defaults boundary

### ✅ Correct Pattern

```yaml
placeholders:
  TONE:
    type: string
    required: false
```

Defaults go in a `.defaults.json` file.

---

## 4. Over-Generic “God Templates”

### ❌ Anti-Pattern

```yaml
placeholders:
  ANYTHING:
    type: object
```

```text
{{ANYTHING}}
```

### Why this is wrong

This defeats the entire architecture:

* no meaningful schema
* no validation
* no linting
* no guardrails

It’s equivalent to “just paste whatever”.

### ✅ Correct Pattern

Break it down:

```yaml
placeholders:
  OBJECTIVE:
    type: string
    required: true

  CONSTRAINTS:
    type: array
    items:
      type: string
```

If you can’t name it, you don’t understand it yet.

---

## 5. Implicit Section Overrides

### ❌ Anti-Pattern

Child template silently redefines a section:

```yaml
sections:
  INTRO:
    text: |
      You are a Java developer.
```

### Why this is wrong

Silent overrides are:

* invisible during review
* brittle during refactors
* impossible to reason about at scale

### ✅ Correct Pattern

```yaml
sections:
  INTRO:
    override: true
    text: |
      You are a Java developer.
```

Overrides must be explicit. Always.

---

## 6. Implicit Section Removal

### ❌ Anti-Pattern

Parent defines a section, child just omits it.

### Why this is wrong

Omission is ambiguous:

* was it forgotten?
* was it intentionally removed?
* did inheritance change?

### ✅ Correct Pattern

```yaml
sections:
  DEBUG:
    remove: true
```

If you remove something, say so.

---

## 7. Placeholders That Aren’t Used Anywhere

### ❌ Anti-Pattern

```yaml
placeholders:
  FORMAT:
    type: string
```

…but never referenced in any section.

### Why this is wrong

Unused placeholders:

* confuse authors
* bloat schemas
* invite misuse via `--set`

### ✅ Correct Pattern

Either:

* reference it explicitly in text
  **or**
* remove it

Templates should be minimal and intentional.

---

## 8. Encoding Behavioural Instructions as Structure

### ❌ Anti-Pattern

```yaml
sections:
  RULES:
    text: |
      Always think step by step.
      Never reveal your reasoning.
```

### Why this is wrong

This hard-codes behavioural policy into structure:

* can’t be linted
* can’t be governed
* can’t evolve safely

### ✅ Correct Pattern

Use placeholders:

```yaml
placeholders:
  REASONING_STYLE:
    type: string

sections:
  RULES:
    text: |
      Reasoning style: {{REASONING_STYLE}}
```

Policy lives in defaults, lint rules, and lifecycle — not raw text.

---

## 9. Inline Context Blobs

### ❌ Anti-Pattern

```yaml
sections:
  CONTEXT:
    text: |
      Here is the full database schema:
      (500 lines of SQL)
```

### Why this is wrong

Inline context:

* bloats templates
* breaks reuse
* defeats dependency injection
* destroys diff readability

### ✅ Correct Pattern

Templates describe *where* context goes, not *what* it is.

Context is injected by the runner via references.

---

## 10. Over-Abstract Inheritance Trees

### ❌ Anti-Pattern

```
base → abstract-base → semi-abstract → specialised → concrete
```

### Why this is wrong

Deep inheritance:

* hides behaviour
* complicates resolution
* makes debugging painful
* adds zero real reuse value

### ✅ Correct Pattern

Prefer:

```
all-purpose → specialised
```

Two levels. Three at most.
If you need more, composition is the wrong tool.

---

## 11. Encoding Output Expectations in Templates

### ❌ Anti-Pattern

```yaml
sections:
  OUTPUT:
    text: |
      Output must be valid JSON with fields A, B, C.
```

### Why this is wrong

Output validation belongs to:

* output schemas
* output assertions
* CI

Templates describe *intent*, not *verification*.

### ✅ Correct Pattern

```yaml
sections:
  OUTPUT:
    text: |
      Produce the requested output.
```

Validation happens after execution.

---

## 12. Treating Templates as Prompts

### ❌ Anti-Pattern

One massive template that tries to be “the perfect prompt”.

### Why this is wrong

Templates are **definitions**, not conversations.

Over-optimising templates:

* kills flexibility
* discourages specialisation
* makes change risky

### ✅ Correct Pattern

* Keep templates small
* Layer specialisation
* Let prompt definitions do the tailoring

---

## 13. Final Smell Test

Before committing a template, ask:

> “Could I safely reuse this in a completely different team, project, or company?”

If the answer is no, you’ve probably violated one of the above.

---

## Summary (Print This)

**Templates should be:**

* explicit
* boring
* composable
* deterministic

**If a template feels clever, it’s probably wrong.**


