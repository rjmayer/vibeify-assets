# Vibeify Template Positive Patterns

This guide documents **proven, recommended patterns** for authoring prompt templates in Vibeify.
These patterns make templates easier to reuse, review, version, and evolve safely.

If you adopt these consistently, your prompt ecosystem will stay sane at scale.

---

## 1. Start from a Canonical Base (`all-purpose`)

### ✅ Pattern

Every non-trivial template extends a stable base:

```yaml
extends: all-purpose.template.v1
```

### Why this works

* Shared structure lives in one place
* Changes propagate predictably
* Reviews focus on *what’s different*, not boilerplate

Think of `all-purpose` as `Object` or `BaseComponent`.

---

## 2. Make Structure Obvious at a Glance

### ✅ Pattern

Sections mirror how a human reasons about the task:

```yaml
sections:
  INTRO:
    text: |
      You are a senior backend engineer.

  GOAL:
    text: |
      {{OBJECTIVE}}

  CONSTRAINTS:
    text: |
      {{CONSTRAINTS}}

  OUTPUT:
    text: |
      {{OUTPUT_SPEC}}
```

### Why this works

* Reviewers can skim structure before reading text
* Changes are localised
* Cognitive load stays low

Good templates are readable *without* reading every word.

---

## 3. Declare Placeholders Early and Explicitly

### ✅ Pattern

Placeholders are obvious, documented, and minimal:

```yaml
placeholders:
  OBJECTIVE:
    type: string
    required: true
    description: What must be achieved

  CONSTRAINTS:
    type: array
    items:
      type: string
    required: false
```

### Why this works

* Derived schemas are clean
* CLI overrides are safe
* No hidden variability

If something can change, it must be visible here.

---

## 4. Use Placeholders to Encode Variability — Not Text Tricks

### ✅ Pattern

```yaml
placeholders:
  TONE:
    type: string
    description: Writing tone

sections:
  STYLE:
    text: |
      Use a {{TONE}} tone.
```

### Why this works

* Variability is explicit
* Defaults can control behaviour centrally
* Linting and policy can reason about it

Never encode variability implicitly in prose.

---

## 5. Strengthen, Don’t Weaken, in Child Templates

### ✅ Pattern

Parent:

```yaml
CONSTRAINTS:
  required: false
```

Child:

```yaml
CONSTRAINTS:
  required: true
```

### Why this works

* Specialisation tightens contracts
* General templates stay flexible
* Inheritance remains safe and predictable

Inheritance should **narrow**, not blur.

---

## 6. Override Sections Sparingly and Loudly

### ✅ Pattern

```yaml
sections:
  INTRO:
    override: true
    text: |
      You are a Node.js API specialist.
```

### Why this works

* Diffs are meaningful
* Intent is explicit
* Refactors don’t surprise anyone

If you override, announce it.

---

## 7. Prefer Small, Composable Templates

### ✅ Pattern

* One template per *conceptual role*
* Shallow inheritance
* Clear purpose

```text
all-purpose
  ↳ code-generation
      ↳ node-api
```

### Why this works

* Easy mental model
* Predictable resolution
* Low blast radius for changes

Large templates rot faster than small ones.

---

## 8. Keep Templates Free of Policy

### ✅ Pattern

Templates say *what to do*, not *how safe it is*.

```yaml
sections:
  GOAL:
    text: |
      {{OBJECTIVE}}
```

Policy lives in:

* lifecycle metadata
* lint rules
* output assertions

### Why this works

* Governance can evolve independently
* Templates remain reusable
* CI can enforce rigor centrally

This separation is one of Vibeify’s biggest strengths.

---

## 9. Make Output Shape a First-Class Concept (Indirectly)

### ✅ Pattern

Templates **describe** output, schemas **validate** output.

```yaml
sections:
  OUTPUT:
    text: |
      Produce the requested result.
```

Output contracts are enforced later by:

* `prompt-output.schema`
* prompt-specific output schemas
* assertions

### Why this works

* Templates stay flexible
* Validation remains machine-checkable
* Creativity isn’t strangled

---

## 10. Version Calmly and Predictably

### ✅ Pattern

```yaml
id: node-api.template.v1
```

Breaking change?

```yaml
id: node-api.template.v2
```

### Why this works

* No surprises
* Old prompts keep working
* Migrations are explicit

Never silently change the meaning of a template ID.

---

## 11. Write Templates for Review, Not the Model

### ✅ Pattern

Readable formatting, comments, clean structure.

### Why this works

* Humans review templates
* Models don’t care about YAML aesthetics
* Bugs are caught earlier

If a human can’t understand it quickly, it’s wrong.

---

## 12. Let Defaults Do the Heavy Lifting

### ✅ Pattern

Template:

```yaml
REASONING_STYLE:
  type: string
```

Defaults:

```json
{
  "REASONING_STYLE": "Analytical, stepwise reasoning."
}
```

### Why this works

* Behaviour can change without touching templates
* Experiments don’t require schema changes
* Organisational preferences stay centralised

Templates define *shape*. Defaults define *culture*.

---

## 13. Treat Templates Like Public APIs

### ✅ Pattern

* Document intent
* Minimise breaking changes
* Be conservative

### Why this works

Templates are depended on by:

* prompt definitions
* CI pipelines
* other teams
* future you

Once published, assume someone else relies on it.

---

## 14. The Gold Standard Test

A good template satisfies all of these:

* ✅ Can be explained in 30 seconds
* ✅ Has no hidden inputs
* ✅ Produces a clean input schema
* ✅ Inherits cleanly
* ✅ Contains zero execution logic
* ✅ Survives being reused in a different project

If it passes that test, it’s probably excellent.

---

## Final Principle

> **Templates are boring on purpose.**

Boring scales.
Clever breaks.


