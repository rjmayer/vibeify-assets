## 3. Prompt Lifecycle State Semantics

### `draft`

* ✏️ Editable
* ▶️ Executable locally
* ❌ Not allowed in CI
* ❌ Outputs not promotable

Use for:

* experimentation
* inbox-refined prompts
* WIP

---

### `review`

* ✏️ Editable
* ▶️ Executable locally
* ⚠️ CI execution allowed but **non-blocking**
* ⚠️ Outputs marked *non-authoritative*

Use for:

* peer review
* AI-assisted review
* dry runs in pipelines

---

### `approved`

* 🔒 Changes require version bump
* ▶️ Executable everywhere
* ✅ CI-blocking assertions enforced
* ✅ Outputs promotable to main artifacts

This is the **default “production” state**.

---

### `deprecated`

* 🔒 No new executions in CI
* ⚠️ Local execution allowed with warning
* 🧭 Must point to successor (`supersedes`)

Use for:

* replacing prompts safely
* migration periods

---

### `archived`

* ❌ Not executable
* ❌ Not editable
* 📦 Retained for audit only

This is the legal / compliance safety net.
