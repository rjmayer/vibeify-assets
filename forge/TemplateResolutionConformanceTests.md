# Template Resolution Conformance Tests

This section defines the **minimum required conformance tests** for any Vibeify-compliant template resolution implementation.

An implementation **MUST** pass **all REQUIRED tests** to claim conformance.
Tests marked **SHOULD** are strongly recommended but not mandatory for v1.

---

## Test Structure (Normative)

Each test case is defined by:

* **Given**: input templates and references
* **When**: template resolution is executed
* **Then**: observable result or failure condition

The system under test exposes a single operation:

```
resolveTemplate(templateRef) → ResolvedTemplate | Error
```

---

## Category A — Basic Resolution

### A1 — Single Template, No Inheritance (REQUIRED)

**Given**

* A template `T` with no `extends`
* Valid sections and placeholders

**When**

* `resolveTemplate(T)` is called

**Then**

* Resolution succeeds
* Output template is structurally identical to `T`
* No inheritance metadata exists in output

---

### A2 — Two-Level Inheritance (REQUIRED)

**Given**

* Template `B` (base)
* Template `C` with `extends: B`

**When**

* `resolveTemplate(C)` is called

**Then**

* Resolution succeeds
* Output contains:

  * all sections from `B`
  * all sections from `C`
* Child overrides take precedence
* No `extends` remains in output

---

## Category B — Determinism

### B1 — Deterministic Resolution (REQUIRED)

**Given**

* A fixed set of templates with inheritance

**When**

* `resolveTemplate(T)` is executed multiple times

**Then**

* The resolved output is byte-for-byte identical every time

---

### B2 — Order Independence of Loading (REQUIRED)

**Given**

* Same templates loaded in different orders

**When**

* `resolveTemplate(T)` is executed

**Then**

* The resolved output is identical

---

## Category C — Inheritance Graph Validation

### C1 — Circular Inheritance (REQUIRED)

**Given**

* Template `A` extends `B`
* Template `B` extends `A`

**When**

* `resolveTemplate(A)` is called

**Then**

* Resolution fails
* Error reason includes *circular inheritance*
* No partial output is produced

---

### C2 — Deep Circular Inheritance (REQUIRED)

**Given**

* `A → B → C → A`

**When**

* `resolveTemplate(A)` is called

**Then**

* Resolution fails
* Cycle is detected regardless of depth

---

### C3 — Multiple Parents (REQUIRED)

**Given**

* Template `A` declares more than one parent

**When**

* `resolveTemplate(A)` is called

**Then**

* Resolution fails
* Error reason indicates *multiple inheritance unsupported*

---

## Category D — Placeholder Rules

### D1 — Placeholder Inheritance (REQUIRED)

**Given**

* Parent template defines placeholder `X`
* Child does not redeclare `X`

**When**

* Resolution succeeds

**Then**

* Resolved template contains placeholder `X`

---

### D2 — Placeholder Redeclaration, Compatible (REQUIRED)

**Given**

* Parent defines placeholder `X` as optional string
* Child redeclares `X` as required string

**When**

* Resolution succeeds

**Then**

* Resolved placeholder `X` is required string

---

### D3 — Placeholder Type Conflict (REQUIRED)

**Given**

* Parent defines placeholder `X` as string
* Child redeclares `X` as array

**When**

* Resolution runs

**Then**

* Resolution fails
* Error reason indicates *type incompatibility*

---

### D4 — Weakening Constraints (REQUIRED)

**Given**

* Parent defines placeholder `X` as required
* Child redeclares `X` as optional

**When**

* Resolution runs

**Then**

* Resolution fails
* Error reason indicates *constraint weakening*

---

### D5 — Undeclared Placeholder Reference (REQUIRED)

**Given**

* Child template references placeholder `Y`
* Neither child nor parent declares `Y`

**When**

* Resolution runs

**Then**

* Resolution fails
* Error reason indicates *undeclared placeholder*

---

## Category E — Section Rules

### E1 — Section Inheritance (REQUIRED)

**Given**

* Parent defines section `INTRO`
* Child defines no `INTRO`

**When**

* Resolution succeeds

**Then**

* Resolved template includes section `INTRO`

---

### E2 — Explicit Section Override (REQUIRED)

**Given**

* Parent defines section `INTRO`
* Child explicitly overrides `INTRO`

**When**

* Resolution succeeds

**Then**

* Child’s version of `INTRO` appears in resolved output

---

### E3 — Explicit Section Removal (REQUIRED)

**Given**

* Parent defines section `INTRO`
* Child explicitly removes `INTRO`

**When**

* Resolution succeeds

**Then**

* Resolved template does not contain `INTRO`

---

### E4 — Silent Section Omission (REQUIRED)

**Given**

* Parent defines section `INTRO`
* Child does not reference `INTRO` at all
* Child does not explicitly remove it

**When**

* Resolution succeeds

**Then**

* Resolved template still contains `INTRO`

---

## Category F — Schema Derivability

### F1 — Single Input Schema (REQUIRED)

**Given**

* A resolved template

**When**

* Input schema is derived

**Then**

* Exactly one valid JSON Schema is produced
* Schema includes all resolved placeholders
* `additionalProperties` is `false`

---

### F2 — No Hidden Inputs (REQUIRED)

**Given**

* Inherited placeholders from multiple levels

**When**

* Input schema is derived

**Then**

* All placeholders are visible in schema
* No placeholder is excluded due to inheritance depth

---

## Category G — Boundary Enforcement

### G1 — Execution Metadata in Template (REQUIRED)

**Given**

* A template containing `promptId`, `promptClass`, or `lifecycle`

**When**

* Resolution runs

**Then**

* Resolution fails
* Error reason indicates *execution metadata forbidden*

---

### G2 — Defaults in Template (REQUIRED)

**Given**

* A template attempts to define default values inline

**When**

* Resolution runs

**Then**

* Resolution fails
* Error reason indicates *defaults not allowed in templates*

---

### G3 — Governance Leakage via Inheritance (REQUIRED)

**Given**

* Parent template contains governance fields
* Child extends parent

**When**

* Resolution runs

**Then**

* Resolution fails before merge
* Error points to invalid parent template

---

## Category H — Flattening Guarantees

### H1 — No Inheritance Artifacts (REQUIRED)

**Given**

* Any inherited template

**When**

* Resolution succeeds

**Then**

* Resolved template contains:

  * no `extends`
  * no parent references
  * no inheritance metadata

---

### H2 — Standalone Equivalence (REQUIRED)

**Given**

* A resolved template `R`
* A hand-written standalone template `S` with identical content

**When**

* Input schemas are derived from both

**Then**

* Schemas are identical
* Rendered prompt text is identical

---

## Category I — Failure Semantics

### I1 — Fail Fast (REQUIRED)

**Given**

* A template that violates any REQUIRED rule

**When**

* Resolution is invoked

**Then**

* Resolution aborts immediately
* No partial template is exposed
* No schema is generated

---

### I2 — Error Specificity (SHOULD)

**Given**

* A failure scenario

**When**

* Resolution fails

**Then**

* Error includes:

  * template reference
  * failure category
  * reason string suitable for humans

---

## Minimum Compliance Bar

An implementation is **Vibeify-compliant** if it passes:

* All **REQUIRED** tests in Categories A–I

---

## Why This Matters (Non-Normative Note)

These tests deliberately mirror compiler conformance suites:

* inheritance ≈ AST construction
* resolution ≈ semantic analysis
* schema derivation ≈ type checking

If an implementation passes this suite, you get:

* zero ambiguity
* predictable CLI behaviour
* enforceable governance guarantees
