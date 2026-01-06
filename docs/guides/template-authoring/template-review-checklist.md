Below is a **Template Review Checklist** designed to be used **directly in PRs**.

It’s opinionated, short enough to actually be used, and maps 1:1 to the architecture you’ve locked in. Reviewers should be able to tick boxes without rereading the whole spec.

You can paste this into:

* `/vibeify/docs/template-review-checklist.md`
* a GitHub PR template
* or a CODEOWNERS review guide

---

# Vibeify Template Review Checklist (PRs)

Use this checklist when reviewing **prompt template changes**.
If any ❌ item fails, the PR should not be merged.

---

## 1. Identity & Scope

* [ ] **Template ID is stable and versioned**

  * Uses a clear name and explicit version (`*.template.v1`)
* [ ] **Template purpose is clear**

  * `description` explains *what this template is for*
* [ ] **Change scope is appropriate**

  * No unrelated refactors or stylistic churn

---

## 2. Schema Compliance (Hard Gate)

* [ ] **Validates against `prompt-template.schema.v1.json`**
* [ ] **No extra top-level fields**

  * Only `id`, `extends`, `description`, `sections`, `placeholders`
* [ ] **No forbidden content present**

  * ❌ execution metadata
  * ❌ lifecycle fields
  * ❌ defaults
  * ❌ model / temperature / backend config
  * ❌ lint rules or assertions

---

## 3. Inheritance & Structure

* [ ] **Inheritance is shallow and justified**

  * Extends at most one parent
  * Parent choice makes sense
* [ ] **Overrides are explicit**

  * `override: true` used where parent sections change
* [ ] **Removals are explicit**

  * `remove: true` used where parent sections are dropped
* [ ] **No silent structural changes**

  * Parent sections are not accidentally omitted or redefined

---

## 4. Sections

* [ ] **Section names are stable and meaningful**
* [ ] **Section text is readable and intentional**

  * No accidental verbosity or copy-paste noise
* [ ] **Sections reference declared placeholders only**
* [ ] **No inline context blobs**

  * Large context belongs in injected files, not template text

---

## 5. Placeholders

* [ ] **All placeholders are declared**

  * No undeclared `{{PLACEHOLDER}}` references
* [ ] **Names use `SCREAMING_SNAKE_CASE`**
* [ ] **Types are appropriate**

  * Arrays declare `items.type`
* [ ] **Required flags make sense**

  * Required only when truly mandatory
* [ ] **No defaults in template**

  * Defaults live in `.defaults.json` only
* [ ] **No unused placeholders**

  * Every placeholder is referenced or intentionally reserved

---

## 6. Inheritance Safety (If Applicable)

* [ ] **Placeholder redeclarations are legal**

  * No incompatible type changes
  * No required → optional weakening
* [ ] **Specialisation narrows, not broadens**

  * Child templates strengthen constraints
* [ ] **Resolved template remains coherent**

  * Reviewer can mentally flatten it without surprises

---

## 7. Input Schema Impact

* [ ] **Derived input schema change is intentional**

  * New required fields justified
  * Breaking changes acknowledged
* [ ] **`additionalProperties: false` remains valid**

  * No expectation of ad-hoc inputs
* [ ] **CLI overrides (`--set`) still behave predictably**

---

## 8. Versioning & Compatibility

* [ ] **Breaking changes bump the version**
* [ ] **Non-breaking changes reuse version**
* [ ] **No silent behaviour changes under same ID**

Rule of thumb:

> If an existing prompt definition would fail after this change, the version must change.

---

## 9. Architectural Boundaries (Critical)

* [ ] **Template contains content only**
* [ ] **No policy encoded in prose**

  * Safety, governance, and risk live elsewhere
* [ ] **No execution assumptions**

  * Template does not assume model behaviour or backend quirks

---

## 10. Human Review Quality

* [ ] **Template is easy to understand**

  * Purpose clear in < 30 seconds
* [ ] **Diff is readable**

  * Changes are local and well-scoped
* [ ] **No cleverness**

  * Boring, explicit, predictable

---

## 11. Final Smell Test (Mandatory)

Answer **yes** to all:

* [ ] Could this template be reused in another project?
* [ ] Could another team understand and extend it?
* [ ] Would I be comfortable supporting this in 12 months?
* [ ] Does this align with “templates as architecture”?

If any answer is “no”, request changes.

---

## Reviewer Guidance (Non-Negotiable)

* **Do not** approve “it works” templates
* **Do not** allow exceptions for convenience
* **Do not** merge speculative flexibility

Templates are shared infrastructure.

---

## Reviewer Shortcut (If You’re Busy)

If you only check three things, check these:

1. ❌ No forbidden fields
2. ❌ No hidden placeholders
3. ❌ No silent inheritance behaviour

If those pass, the rest is usually fine.

---

## Closing Principle

> **A template PR is an architectural change, not a content tweak.**

Treat it with the same discipline as a public API change.

---

If you want, next we can:

* turn this into a **GitHub PR template**
* add **automated checklist enforcement** (lint + CI)
* or create a **template maturity rubric** (draft → stable)

Just say which direction you want to go.
