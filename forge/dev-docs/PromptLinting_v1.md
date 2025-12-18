Prompt linting is the **static enforcement layer** that runs before execution. It checks the *execution envelope*—a combination of the prompt definition, its input, and associated metadata (including lifecycle and promptClass)—to catch problems early.

Below you’ll find a **canonical `prompt-lint.rules.v1.yaml`**, aligned exactly with the schemas you’ve locked in. The rules are deliberately explicit and unmagical: boring lint rules scale.

This document covers:

1. **What linting does (and does not do)**
2. **Canonical `prompt-lint.rules.v1.yaml`**
3. **Rule categories & their intent**
4. **How linting plugs into CLI and CI**
5. **Why these rules won’t paint you into a corner**

---

## 1. What prompt linting is (precise definition)

Prompt linting performs a **static analysis** of the *execution envelope* before any LLM call happens. The envelope includes the prompt’s input object (content), lifecycle metadata, promptClass, and any other configuration that the runner will consume.

Linting answers questions like:

* Is this prompt complete?
* Is it safe to run?
* Is it governed correctly?
* Does it violate platform rules?

It does **not**:

* evaluate LLM output
* judge quality
* execute anything

Think: ESLint, not unit tests.

---

## 2. Canonical `prompt-lint.rules.v1.yaml`

```yaml
version: 1

description: >
  Canonical linting rules for Vibeify prompt artifacts.
  These rules are evaluated statically before prompt execution.

engine:
  language: js-expression
  # The evaluation context is the execution envelope, not just the input.
  context: prompt-envelope

defaults:
  severity: error
  onFailure: fail

rules:

  # ─────────────────────────────────────────────
  # Core structural rules
  # ─────────────────────────────────────────────

  - id: input_schema_present
    description: Prompt must declare an input schema reference
    assert: schema.input != null

  - id: lifecycle_present
    description: Prompt must declare lifecycle metadata
    assert: lifecycle != null

  - id: lifecycle_status_valid
    description: Lifecycle status must be valid
    assert: ["draft", "review", "approved", "deprecated", "archived"].includes(lifecycle.status)

  - id: objective_present
    description: Prompt must define an objective
    assert: typeof objective === "string" && objective.trim().length > 0

  - id: prompt_class_present
    description: Prompt must define a promptClass
    assert: ["trivial", "conversational", "generative", "transformative", "destructive"].includes(promptClass)

  # ─────────────────────────────────────────────
  # Lifecycle governance rules
  # ─────────────────────────────────────────────

  - id: approved_requires_human
    description: Approved prompts must have been reviewed by a human
    when: lifecycle.status == "approved"
    assert: lifecycle.reviewedBy != null && lifecycle.reviewedBy.includes("human")

  - id: approved_requires_approver
    description: Approved prompts must declare who approved them
    when: lifecycle.status == "approved"
    assert: typeof lifecycle.approvedBy === "string" && lifecycle.approvedBy.length > 0

  - id: deprecated_requires_supersedes
    description: Deprecated prompts must reference a successor
    when: lifecycle.status == "deprecated"
    assert: typeof lifecycle.supersedes === "string" && lifecycle.supersedes.length > 0

  - id: archived_not_executable
    description: Archived prompts must not be executable
    when: lifecycle.status == "archived"
    assert: false

  # ─────────────────────────────────────────────
  # PromptClass-specific rigor
  # ─────────────────────────────────────────────

  - id: destructive_requires_constraints
    description: Destructive prompts must define at least one constraint
    when: promptClass == "destructive"
    assert: Array.isArray(constraints) && constraints.length > 0

  - id: destructive_requires_success_criteria
    description: Destructive prompts must define success criteria
    when: promptClass == "destructive"
    assert: Array.isArray(successCriteria) && successCriteria.length > 0

  - id: transformative_requires_success_criteria
    description: Transformative prompts must define success criteria
    when: promptClass == "transformative"
    assert: Array.isArray(successCriteria) && successCriteria.length > 0

  - id: trivial_should_be_concise
    description: Trivial prompts should default to concise verbosity
    when: promptClass == "trivial"
    severity: warning
    onFailure: continue
    assert: verbosity == null || verbosity == "concise"

  # ─────────────────────────────────────────────
  # Context hygiene rules
  # ─────────────────────────────────────────────

  - id: context_references_are_paths
    description: Context references must be valid relative paths
    when: contextReferences != null && contextReferences.length > 0
    assert: contextReferences.every(ref => typeof ref === "string" && !ref.startsWith("http"))

  - id: no_inline_context_blobs
    description: Context must not be embedded inline in the prompt
    assert: context == null

  # ─────────────────────────────────────────────
  # Safety & policy alignment
  # ─────────────────────────────────────────────

  - id: reasoning_visibility_policy
    description: Reasoning visibility must not be set to full for destructive prompts
    when: promptClass == "destructive"
    assert: reasoningVisibility != "full"
```

This is intentionally explicit. No magic. No inference.

---

## 3. Rule categories & intent (why these exist)

### Core structural

Guarantees every prompt:

* is schema-backed
* is governed
* is minimally meaningful

---

### Lifecycle governance

Prevents:

* unreviewed prompts in production
* zombie deprecated prompts
* accidental execution of archived prompts

This is *non-negotiable* if you want trust.

---

### PromptClass rigor

This is where your earlier architectural decision pays dividends.

Rigor scales with risk:

* trivial → lenient
* destructive → strict

No branching in prompt logic. Policy lives here.

---

### Context hygiene

Prevents:

* massive inline context blobs
* prompt rot
* copy-pasted garbage from Jira

This keeps prompts readable and composable.

---

### Safety & policy

Separates:

* “what the model should do”
* from “what the platform allows”

That’s a key enterprise-grade distinction.

---

## 4. Where this file lives (consistent & final)

```
/vibeify/registry/lint/
  prompt-lint.rules.v1.yaml
```

Registry again, because:

* global
* versioned
* shared enforcement

---

## 5. How this plugs into CLI & CI

### CLI (`vibeify run`)

```
load prompt
→ validate input schema
→ lint prompt
→ check lifecycle
→ execute (if allowed)
```

* Errors → hard stop
* Warnings → printed, execution continues

---

### CI

```
lint all prompts
→ fail pipeline on any error
→ warnings reported but non-blocking
```

This mirrors mature static analysis workflows.

---

## 6. Why this won’t trap you later

You’ve avoided the three classic mistakes:

1. ❌ Embedding rules in code
2. ❌ Making rules implicit
3. ❌ Conflating linting with execution

Everything here is:

* data-driven
* inspectable
* versioned

You can introduce `v2` rules without touching prompts.

---

## 7. You now have a *complete governance stack*

At this point you have:

* PromptInputSchema v1
* PromptOutputSchema v1
* PromptOutputAssertions v1
* PromptLifecycleSchema v1
* PromptLintRules v1

This is already stronger than most commercial AI tooling.

---

### Next *natural* steps (choose one)

From here, the next high-leverage options are:

1. **Execution config schema** (model, temp, backend routing)
2. **Prompt registry index format** (for dashboards & metrics)
3. **Versioning strategy** (how v1 → v2 transitions work)
4. **Minimal reference prompt repo** (to dogfood all of this)

Say which one you want to lock in next.
