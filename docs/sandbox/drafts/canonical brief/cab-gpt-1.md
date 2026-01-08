## **Vibeify — Canonical Architecture Brief**

### **Purpose**

Vibeify exists to treat **prompts as first-class architectural artefacts**, subject to the same rigor as source code.
Its purpose is to make AI-assisted work **deterministic, auditable, governable, and reusable** across humans and machines.

Anything that undermines determinism, separation of concerns, or mechanical enforcement is architecturally invalid.

---

### **Core Principles**

1. **Prompts Are Code**
   Prompts are not ad-hoc text. They are structured artefacts with schemas, validation, lifecycle, and versioning.

2. **Strict Separation of Concerns**
   Content, governance, execution, and policy are separate layers and must never leak into one another.

3. **Templates Are the Single Source of Truth**
   All prompt structure and variability originate in templates. Nothing else may introduce inputs or structure.

4. **Schemas Enforce, Humans Don’t**
   Architectural rules are enforced mechanically via schemas, linting, and assertions—not by convention or discipline.

5. **Deterministic Assembly**
   Prompt rendering, validation, and execution must be deterministic given the same inputs and versions.

6. **Risk-Scaled Governance**
   The rigor applied to prompts scales strictly with their declared risk class (`promptClass`).

---

### **Architectural Boundaries (Non-Negotiable)**

#### **1. Prompt Templates**

* Define **structure and placeholders only**.
* Declare all allowed variability explicitly as placeholders.
* May use single inheritance, resolved into a single flattened template.
* Must never contain execution, lifecycle, defaults, or policy.

#### **2. Input Schemas**

* Are **derived automatically** from resolved templates.
* Forbid undeclared inputs (`additionalProperties: false`).
* Validate content shape only, never behaviour.

#### **3. Defaults**

* Provide baseline values for optional placeholders.
* Must not introduce new keys.
* Must not satisfy required fields implicitly.

#### **4. Prompt Definitions**

* Are **content-only artefacts**.
* May contain **only**:

  * `templateRef`
  * `defaultsRef` (optional)
  * `input`
* Must never include execution, lifecycle, IDs, classes, tests, or policies.

#### **5. Execution Envelopes**

* Wrap prompt definitions at runtime.
* Contain governance and observability:

  * `promptId`
  * `promptClass`
  * `lifecycle`
  * execution metadata
* Are the sole input to linting, execution, and CI.

#### **6. Linting**

* Performs **static analysis before execution**.
* Operates on the execution envelope.
* Enforces structural completeness, governance rules, and safety constraints.
* Must block execution on errors.

#### **7. Execution**

* The renderer sees **content only**.
* The runner enforces lifecycle and policy.
* Execution must not mutate definitions or templates.

#### **8. Output Envelopes**

* Wrap raw LLM output in a machine-readable structure.
* Validate shape, not semantic correctness.
* Are the only artefact evaluated by assertions and CI.

#### **9. Assertions**

* Are policy rules over output envelopes.
* Are selected by `promptClass`.
* Determine acceptability, not quality.

---

### **Explicit Non-Goals**

The system **must not**:

* Allow ad-hoc or free-form prompt parameters.
* Encode governance, lifecycle, or execution hints inside prompt content.
* Validate or enforce semantic “quality” of model output.
* Bind prompts to a specific programming language, framework, or IDE.
* Rely on human convention where a schema or rule can enforce correctness.
* Conflate workflow tools (tickets, Jira, releases) with prompt governance.
* Introduce hidden behaviour, implicit defaults, or magic inference.

---

### **Architectural Law**

If a change:

* weakens separation between content and execution
* allows undeclared variability
* bypasses schema, linting, or lifecycle enforcement
* makes behaviour less deterministic or auditable

**the change is architecturally invalid.**

This brief is the system’s constitution.
