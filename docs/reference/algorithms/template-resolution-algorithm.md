# Template Resolution Algorithm (Formal)

This section defines the **canonical algorithm** for resolving prompt templates with inheritance in Vibeify.
Any implementation **MUST** produce results equivalent to this algorithm.

The algorithm is expressed declaratively and procedurally so that it can be translated into code, tests, or formal verification without ambiguity.

---

## Definitions

* **Template**: A YAML document defining prompt structure, placeholders, and optional inheritance metadata.
* **Parent Template**: The single template referenced via `extends` (or equivalent).
* **Resolved Template**: A fully flattened template with no inheritance metadata.
* **Template Graph**: A directed graph where each node is a template and each edge points to its parent.

---

## Inputs

* `T_root`: the template referenced by a prompt definition
* `TemplateLoader(ref)`: a deterministic function that loads a template by reference
* `Validator`: a schema/structural validator for individual templates

---

## Outputs

* `T_resolved`: a fully resolved template
* OR a **hard failure** with a specific error condition

---

## Phase 0 — Pre-Validation (Single Template)

Before inheritance is considered, each loaded template **MUST** pass basic validation.

For each template `T` loaded:

1. Validate `T` against the **template schema**
2. Reject `T` if it contains:

   * execution metadata
   * lifecycle metadata
   * governance fields
3. Reject `T` if placeholder declarations are malformed

Failure at this stage **MUST** abort resolution.

---

## Phase 1 — Build Inheritance Chain

### Step 1.1 — Load Chain

```
chain = []
current = T_root
```

While `current` declares a parent:

1. Append `current` to `chain`
2. Load `parent = TemplateLoader(current.parentRef)`
3. If `parent` is already in `chain` → **FAIL (circular inheritance)**
4. Set `current = parent`

Finally, append the last `current` (the root ancestor).

Result:

```
chain = [T_root, T_parent, T_grandparent, ..., T_base]
```

---

### Step 1.2 — Validate Chain

1. Ensure `chain.length >= 1`
2. Ensure each template declares **at most one** parent
3. Ensure no template appears more than once

Failure → **FAIL (invalid inheritance graph)**

---

## Phase 2 — Linearisation

Reverse the chain to obtain **resolution order**:

```
resolutionOrder = reverse(chain)
```

This ensures:

* Base template is applied first
* Most specific template is applied last

Example:

```
all-purpose → specialised → domain-specific
```

---

## Phase 3 — Initialise Resolution State

Create an empty resolution state:

```
ResolvedTemplate = {
  sections: {},
  placeholders: {},
  rendererRules: {}
}
```

No defaults, execution data, or metadata are allowed in this state.

---

## Phase 4 — Merge Templates (Core Algorithm)

For each template `T` in `resolutionOrder`, perform the following steps **in order**.

---

### Step 4.1 — Merge Sections

For each section `S` in `T.sections`:

1. If `S` does not exist in `ResolvedTemplate.sections`
   → add `S`

2. If `S` exists and `T` declares an explicit override
   → replace `S`

3. If `T` declares explicit removal of `S`
   → remove `S`

4. Otherwise
   → leave inherited section unchanged

Silent omission **MUST NOT** occur.

---

### Step 4.2 — Merge Placeholders

For each placeholder `P` in `T.placeholders`:

#### Case A — New Placeholder

If `P` does not exist in `ResolvedTemplate.placeholders`:

* Add `P` verbatim

#### Case B — Redeclared Placeholder

If `P` exists:

1. Verify type compatibility

   * incompatible types → **FAIL**
2. Verify constraint direction

   * required → optional → **FAIL**
3. Merge metadata:

   * required flag → strongest wins
   * documentation → child overrides parent
   * additional metadata → merged

---

### Step 4.3 — Merge Renderer Instructions

For renderer-affecting rules (ordering hints, layout rules):

* Child rules **override** parent rules explicitly
* No implicit merging is allowed

---

## Phase 5 — Post-Merge Validation

After all templates are merged:

1. Ensure no duplicate placeholder names exist
2. Ensure all required placeholders are present
3. Ensure no undeclared placeholders are referenced in sections
4. Ensure the resolved template:

   * contains no `extends` or parent references
   * contains no execution or governance fields

Failure → **FAIL (invalid resolved template)**

---

## Phase 6 — Finalisation

Produce `T_resolved` such that:

* It is structurally equivalent to a standalone template
* It can be passed directly into:

  * input schema derivation
  * prompt rendering
* Downstream systems cannot distinguish it from a non-inherited template

Return `T_resolved`.

---

## Phase 7 — Guaranteed Properties

A successfully resolved template **MUST** satisfy:

1. **Determinism**
   Same inputs → same output

2. **Completeness**
   All placeholders and sections are explicitly defined

3. **Schema-Derivability**
   Exactly one input schema can be derived

4. **Boundary Integrity**
   No execution, lifecycle, or governance leakage

---

## Failure Semantics (Normative)

Any failure at any phase **MUST**:

* Abort resolution immediately
* Produce a non-recoverable error
* Prevent:

  * schema generation
  * linting
  * execution

Partial resolution **MUST NOT** be exposed.

---

## Summary

This algorithm guarantees that template inheritance in Vibeify is:

* predictable
* auditable
* schema-safe
* strictly content-layer only

It deliberately mirrors the discipline of a compiler’s front-end:
inheritance is resolved early, flattened completely, and never leaked into runtime behaviour.
