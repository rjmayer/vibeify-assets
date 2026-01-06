## 1.8 Template Resolution and Inheritance (Normative)

This section defines the **mandatory requirements** for template resolution and inheritance in Vibeify.
Any implementation claiming conformance to the Vibeify prompt architecture **MUST** satisfy all requirements in this section.

### 1.8.1 Scope and Responsibility

1. Template resolution **MUST** be performed by the renderer before:

   * input schema derivation
   * defaults merging
   * linting
   * execution

2. Prompt definitions, execution envelopes, and CLI overrides **MUST NOT** be aware of template inheritance.

3. Only the **fully resolved template** **MUST** be used for:

   * input schema derivation
   * prompt rendering
   * validation

4. Template resolution **MUST** be treated as a **compile-time content operation**, not a runtime concern.

---

### 1.8.2 Inheritance Model

1. A template **MAY** declare at most one parent template.

2. Multiple inheritance **MUST NOT** be supported.

3. Circular inheritance **MUST NOT** be permitted.

4. Template inheritance **MUST** be resolved using a deterministic, linear process equivalent to:

   1. Resolve the parent template.
   2. Resolve all ancestors recursively.
   3. Merge the child template onto the resolved parent.
   4. Produce a single flattened template with no inheritance metadata remaining.

5. After resolution, the resulting template **MUST NOT** contain:

   * references to parent templates
   * unresolved inheritance markers
   * conditional inheritance logic

---

### 1.8.3 Inherited Elements

During resolution, the following elements **MUST** participate in inheritance:

1. Prompt structure, including:

   * section ordering
   * headings
   * static content blocks

2. Placeholder declarations, including:

   * placeholder names
   * types
   * required/optional flags
   * placeholder documentation

3. Structural renderer instructions that affect prompt assembly.

The following elements **MUST NOT** participate in inheritance:

* defaults values
* execution metadata
* lifecycle metadata
* model configuration
* linting rules
* assertions

---

### 1.8.4 Placeholder Rules

1. All placeholders in the resolved template **MUST** be explicitly declared in the template hierarchy.

2. A child template **MAY** redeclare a placeholder defined by its parent.

3. Redeclaration **MUST NOT**:

   * change the placeholder’s type incompatibly
   * weaken constraints (e.g. required → optional)
   * remove a required placeholder without replacement

4. Redeclaration **MAY**:

   * strengthen constraints (e.g. optional → required)
   * refine documentation
   * add additional descriptive metadata

5. A child template **MUST NOT** reference placeholders that are not declared in its own template or an ancestor template.

---

### 1.8.5 Section Override Rules

1. A child template **MAY** override sections defined by its parent.

2. Section overrides **MUST** be explicit and name-based.

3. Sections defined in the parent but not explicitly overridden **MUST** be inherited unchanged.

4. Section removal **MUST** be explicit.

5. Silent omission of parent sections **MUST NOT** be allowed.

---

### 1.8.6 Input Schema Derivation

1. Input schema derivation **MUST** occur only after template resolution has completed successfully.

2. The derived input schema **MUST**:

   * include all placeholders from the resolved template
   * include required placeholders marked as required
   * exclude renderer-injected placeholders
   * set `additionalProperties: false`

3. The derived schema **MUST** make no distinction between:

   * placeholders defined in the base template
   * placeholders defined in child templates

4. CLI overrides (`--set`) **MUST** be validated against the derived schema and **MUST NOT** bypass inheritance rules.

---

### 1.8.7 Error Conditions

Template resolution **MUST FAIL** if any of the following conditions occur:

1. Circular inheritance is detected.
2. A template declares more than one parent.
3. Placeholder type conflicts exist between parent and child.
4. A child attempts to override an undeclared placeholder.
5. Required placeholders are removed without replacement.
6. Execution, lifecycle, or governance fields are present in a template.
7. The resolved template cannot produce a single, unambiguous input schema.

A template that fails resolution **MUST NOT**:

* produce an input schema
* be rendered
* be executed

---

### 1.8.8 Relationship to `all-purpose`

1. `all-purpose` **SHOULD** be treated as the canonical root template.

2. Specialised templates **SHOULD** extend `all-purpose` rather than duplicating shared structure.

3. `all-purpose` **MUST** remain a template, not a framework:

   * it **MUST NOT** enforce execution or governance behaviour
   * it **MUST NOT** introduce implicit rules outside declared placeholders

---

### 1.8.9 Architectural Boundary

1. Template inheritance **MUST** affect **content structure only**.

2. Template inheritance **MUST NOT**:

   * influence lifecycle semantics
   * alter `promptClass` behaviour
   * inject execution metadata
   * affect output validation or assertions

3. Governance, validation, and execution behaviour **MUST** remain exclusively the responsibility of:

   * execution envelopes
   * linting rules
   * assertion rules

---

### Summary (Normative)

Any Vibeify-compliant implementation **MUST** resolve templates into a single flattened, schema-derivable artifact before execution.
Inheritance exists solely to enable reuse and specialisation at the content layer and **MUST NOT** leak into execution, governance, or policy layers.

Failure to resolve a template deterministically and unambiguously **MUST** be treated as a hard architectural error.
