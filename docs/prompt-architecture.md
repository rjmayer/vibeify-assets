# Vibeify Prompt Architecture

This document serves as the canonical source of truth for how Vibeify structures, validates, executes, and governs prompts.  It consolidates the individual design documents into a single narrative so that coding agents, AI assistants, and human developers all share the same mental model.

At a high level, Vibeify separates **prompt content** from **execution metadata**.  Content lives in a template and an input schema; execution metadata lives in an envelope that wraps a prompt definition when it is executed.  This separation ensures that creative content can be reused across environments while governance and observability can evolve independently.

## 1. Core Concepts

### 1.1 Templates and Placeholders

A **prompt template** is a structured Markdown document that defines the sections of a prompt and names the variables that must be supplied.  Placeholder names are written in `SCREAMING_SNAKE_CASE` and describe the concept to fill, such as `OBJECTIVE`, `SUCCESS_CRITERIA`, or `FINAL_INSTRUCTION`.  Each placeholder in the YAML representation includes metadata about type, whether it is required, and any default values.

The template is the single source of truth for what inputs exist.  No undeclared placeholder may be supplied by a prompt definition; conversely, no required placeholder may be omitted without a default.  This contract is enforced by deriving a JSON Schema from the template.

### 1.2 Deriving the Input Schema

Vibeify automatically generates a **prompt input schema** from the YAML template.  The derivation algorithm is deterministic:

1. Read the `placeholders` section of the template.
2. Ensure each placeholder has a valid type and, if applicable, an `items` type for arrays.
3. Build the `properties` section of the JSON Schema using the placeholder names verbatim.
4. Collect all placeholders marked `required: true`, except those injected by the renderer (such as `TIMESTAMP`), into the schema’s `required` array.
5. Set `additionalProperties: false` to forbid undeclared keys.
6. Wrap the result with standard JSON Schema fields (`$schema`, `title`, etc.).

The resulting schema (for example, `all‑purpose-input.schema.v1.json`) ensures that any prompt definition supplies the necessary content variables and uses the correct types.  Renderer-injected fields like `TIMESTAMP` are excluded because they are supplied automatically at runtime.

### 1.3 Defaults

Defaults (`all‑purpose.defaults.v1.json`) provide opinionated starting values for optional placeholders.  They are not part of the schema; defaults are merged with user-provided inputs before validation.  Defaults encode your organisation’s preferred operating principles, reasoning styles, or other preferences, but they never introduce new keys or satisfy required fields.

### 1.4 Prompt Definitions

A **prompt definition** ties together a template, an optional defaults file, and a concrete `input` object.  It does not include execution metadata.  The definition looks like this:

```yaml
templateRef: registry/templates/all-purpose/prompt-template.yaml
defaultsRef: registry/templates/all-purpose/all-purpose.defaults.v1.json
input:
  OBJECTIVE: "Tell a joke"
  SUCCESS_CRITERIA:
    - "The response is arguably funny"
    - "The response is complete"
    - "The response follows the required output format"
```

During rendering, Vibeify loads the template, merges defaults and input (with user input taking precedence), validates the merged object against the derived input schema, and produces a fully rendered prompt.

### 1.5 Execution Envelope

When a prompt definition is executed, it is wrapped in an **execution envelope**.  The envelope extends the definition with metadata required for governance and observability:

- `promptId` – a stable identifier for the prompt version being run.
- `promptClass` – a classification that indicates the risk or behaviour category (e.g. trivial, conversational, generative, transformative, destructive).
- `lifecycle` – governance state information (see Section 2 below).
- `execution` settings – such as model name, temperature, run identifier, and timestamp.
- The validated `input` object derived from the template.

The envelope exists so that content and governance can evolve independently.  The renderer sees only the input; the runner and CI see the full envelope.

## 2. Lifecycle and Governance

### 2.1 Purpose of Lifecycle

Lifecycle metadata governs when and how a prompt may be executed and whether its outputs may be trusted.  It sits in the execution envelope, not in the template or input schema.  Lifecycle answers three questions:

1. **Can this prompt be executed?** Local runs may be permitted while CI runs are blocked.
2. **Can its output be trusted or promoted?** Outputs from unapproved prompts must not be treated as authoritative.
3. **Can this definition evolve?** Certain states allow edits without version bumps, while others require bumping the prompt version.

Lifecycle is not a workflow engine; it does not replace ticketing or release processes.  It functions like branch protection rules for prompts.

### 2.2 Lifecycle States

Lifecycle states and their semantics are defined in `prompt-lifecycle.schema.v1.json` and `prompt-lifecycle-states.md`:

| State       | Description | Execution | CI | Promotion |
|-------------|-------------|-----------|----|-----------|
| `draft`     | Editable, experimental state | ✅ local only (warn) | ❌ | ❌ |
| `review`    | Under peer or AI review | ✅ local | ✅ non‑blocking (warn) | ⚠️ non‑authoritative |
| `approved`  | Production‑ready | ✅ everywhere | ✅ blocking | ✅ promotable |
| `deprecated`| Being replaced; must reference a successor | ⚠️ local only (warn) | ❌ | ❌ |
| `archived`  | Frozen for audit/compliance | ❌ | ❌ | ❌ |

Lifecycle metadata is validated against `prompt-lifecycle.schema.v1.json`, which specifies the required fields and allowed values.  The runner and CI enforce the semantics: for example, CI must fail if a prompt in the `draft` state is executed.

### 2.3 Enforcement

The CLI (`vibeify run`) inspects the envelope’s lifecycle before executing a prompt.  It refuses to run `draft` or `deprecated` prompts in CI and prints warnings for `review` or `deprecated` prompts in local development.  In CI, only prompts in the `approved` state may run without warnings, and any assertion failures block the pipeline.

## 3. Output Wrapping and Assertions

### 3.1 Output Envelope

After a prompt runs, the runner wraps the raw LLM output into an **output envelope**.  The envelope contains:

- `promptId` – which prompt generated this output.
- `promptClass` – used for policy and assertion selection.
- `status` – one of `success`, `partial`, or `failed`.
- `output` – the actual text, markdown, JSON, or code returned by the model.
- Optional `warnings` and `errors` arrays.
- Optional `metadata` such as the model name, execution duration, tokens used, and timestamp.

The **PromptOutputSchema v1** validates this structure.  It requires `promptId`, `promptClass`, `status`, and `output` and constrains the allowed values of `status` and `promptClass`.  It does **not** validate the semantic correctness of the output; that is handled by assertions.

### 3.2 Output Assertions

Output assertions (`prompt-output.assertions.v1.yaml`) are machine‑evaluable rules that run after the output schema validation.  They determine whether an output is acceptable, degraded‑but‑usable, or unacceptable.  Assertions operate on the output envelope and use `promptClass` to apply class‑specific rules.  For example:

- For `trivial` prompts, the output must not have a fatal error status.
- For `transformative` prompts, the status must be `success`.
- For `destructive` prompts, the status must be `success` and there must be no errors.

If any assertion fails, the run fails and the CI pipeline blocks.  Assertions separate policy enforcement from template logic.

## 4. Linting

### 4.1 Purpose of Linting

Prompt linting provides static analysis of the execution envelope before any LLM call occurs.  It ensures that definitions and their metadata are complete, consistent, and safe to run.  Linting is inspired by tools like ESLint: it surfaces errors and warnings in development and CI.

### 4.2 Lint Rules

The canonical lint rules live in `prompt-lint.rules.v1.yaml`.  They are evaluated against the execution envelope.  Examples include:

- **Structural** – The envelope must declare an input schema reference and lifecycle metadata.
- **Governance** – Approved prompts must have been reviewed by a human and list an approver; deprecated prompts must reference a successor.
- **PromptClass‑specific** – Destructive prompts must declare at least one constraint and success criterion; trivial prompts should default to concise verbosity.
- **Context hygiene** – Context references must be relative paths; no inline context blobs are allowed.
- **Safety** – Certain combinations of `promptClass` and `reasoningVisibility` are forbidden (e.g. destructive prompts cannot expose full reasoning).

Linting runs both locally and in CI.  Errors prevent execution; warnings do not block but should be addressed.

## 5. Summary of Canonical Schemas and Files

| File                                     | Purpose |
|------------------------------------------|---------|
| `prompt-template.yaml`                   | Defines placeholders and structure of the prompt text. |
| `all-purpose-input.schema.v1.json`       | Derived from the template; validates the content input. |
| `all-purpose.defaults.v1.json`           | Provides opinionated starting values for optional placeholders. |
| `prompt-lifecycle.schema.v1.json`        | Validates lifecycle metadata in the envelope. |
| `prompt-output.schema.v1.json`           | Validates the structure of the output envelope, including `promptClass`. |
| `prompt-lint.rules.v1.yaml`              | Static lint rules for the execution envelope. |
| `prompt-output.assertions.v1.yaml`       | Runtime assertions applied to the output envelope based on `promptClass`. |
| `prompt-lifecycle-states.md`             | Human‑readable definitions of lifecycle states and their semantics. |
| `YAML-to-JSON-Schema-derivation-algorithm.md` | Describes how to generate an input schema from a template. |

## 6. Suggested Next Steps

While Vibeify’s core prompt architecture is stable, you may consider the following extensions and improvements:

1. **Execution Config Schema** – Define a schema for execution settings (model, temperature, max tokens) to accompany the envelope.
2. **Prompt Registry Index** – Create a central registry format (e.g. `prompts.index.json`) that lists available prompts, their IDs, versions, and metadata for dashboards and metrics.
3. **Versioning Strategy** – Establish rules for how to bump versions when templates or schemas change and how to deprecate old prompts cleanly.
4. **Reference Repository** – Maintain a minimal reference repository of prompts that demonstrates best practices and exercises the entire governance stack.
5. **IDE/CLI Integration** – Implement plugins or commands that assist authors in creating and validating prompt definitions directly in their editor.
6. **Prompt‑Specific Output Schemas** – For structured outputs (e.g. JSON), define and register additional schemas that validate the contents of the `output` field beyond the generic envelope.
7. **Advanced Governance Features** – Introduce optional fields in the envelope for owners, risk levels, or change history in future schema versions.

By following this architecture and the suggested next steps, you can scale prompt development across teams while maintaining rigor, repeatability, and trust.