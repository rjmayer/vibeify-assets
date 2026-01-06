# Prompt Lifecycle States
  
> **This document defines the allowed lifecycle states for a prompt's **execution envelope** in the Vibeify system.**  
> The lifecycle state governs whether and how a prompt may be executed and whether its outputs may be trusted or promoted.  
> Lifecycle metadata is part of a prompt’s envelope (the wrapper containing identity and execution metadata), **not** part of the prompt template or content input schema.

## States and their Semantics

### `draft`

- ✏️ **Editable** – The prompt definition may be changed freely.
- ▶️ **Executable locally** – The prompt may be executed in a developer’s environment.
- ❌ **Not allowed in CI** – The prompt is not allowed to run in continuous integration.
- ❌ **Outputs not promotable** – Any output generated must not be treated as authoritative.

Use `draft` for experimentation, inbox‑refined prompts, and work‑in‑progress.

---

### `review`

- ✏️ **Editable** – The prompt can still be modified.
- ▶️ **Executable locally** – Can be run on a developer’s machine.
- ⚠️ **CI allowed but non‑blocking** – In CI the prompt may run but its output does not block the pipeline.
- ⚠️ **Outputs marked non‑authoritative** – Outputs should not be published.

Use `review` when peer or AI review is underway or for dry runs in pipelines.

---

### `approved`

- 🔒 **Changes require version bump** – The prompt becomes read‑only; modifications must bump the template version.
- ▶️ **Executable everywhere** – Can run in any environment.
- ✅ **CI‑blocking assertions enforced** – Output assertions must pass; failures block the pipeline.
- ✅ **Outputs promotable** – Output can be promoted to main artifacts.

This is the default “production” state.

---

### `deprecated`

- 🔒 **No new executions in CI** – The prompt is not allowed to run in CI.
- ⚠️ **Local execution allowed with warning** – A developer may run it locally but will be warned.
- 🧭 **Must point to successor (`supersedes`)** – The envelope should reference the prompt that replaces it.

Use `deprecated` to replace prompts safely during migration.

---

### `archived`

- ❌ **Not executable** – The prompt cannot be run anywhere.
- ❌ **Not editable** – The definition is frozen.
- 📦 **Retained for audit only** – Kept for compliance or historical reference.

Use `archived` for prompts that are no longer needed but must be preserved.