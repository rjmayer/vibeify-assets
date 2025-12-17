Excellent. This completes the **core contract triangle** (input → output → lifecycle). Once this exists, vibeify stops being “prompt tooling” and becomes a **governed system**.

I’ll give you:

1. **What lifecycle means in vibeify (precise, not fluffy)**
2. **Canonical `prompt-lifecycle.schema.v1.json`**
3. **State semantics (what each status *actually* allows)**
4. **How lifecycle interacts with CI, CLI, and humans**
5. **What is deliberately *not* in v1**

---

## 1. What “lifecycle” means here (tight definition)

In vibeify, lifecycle metadata answers exactly three questions:

1. **Can this prompt be executed?**
2. **Can its output be trusted / promoted?**
3. **Is this prompt safe to evolve further?**

It is **not**:

* workflow automation
* ticket tracking
* release management

Think: *Git branch protection rules, but for prompts*.

---

## 2. Canonical `prompt-lifecycle.schema.v1.json`

This schema is intentionally **small, strict, and boring**.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://vibeify.dev/schemas/prompt-lifecycle.schema.v1.json",
  "title": "Vibeify Prompt Lifecycle Schema v1",
  "description": "Defines the lifecycle state and governance metadata for a prompt.",
  "type": "object",
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "type": "string",
      "description": "Current lifecycle status of the prompt.",
      "enum": [
        "draft",
        "review",
        "approved",
        "deprecated",
        "archived"
      ]
    },

    "reviewedBy": {
      "type": "array",
      "description": "Actors who have reviewed this prompt.",
      "items": {
        "type": "string",
        "enum": [
          "human",
          "ai"
        ]
      },
      "default": []
    },

    "approvedBy": {
      "type": "string",
      "description": "Identifier of the human or system that approved this prompt.",
      "minLength": 1
    },

    "lastReviewedAt": {
      "type": "string",
      "description": "ISO timestamp of the most recent review.",
      "format": "date-time"
    },

    "lastApprovedAt": {
      "type": "string",
      "description": "ISO timestamp of approval.",
      "format": "date-time"
    },

    "supersedes": {
      "type": "string",
      "description": "PromptId of the prompt version this one replaces."
    },

    "notes": {
      "type": "string",
      "description": "Optional human-readable notes about lifecycle decisions."
    }
  },
  "additionalProperties": false
}
```

This is deliberately conservative. You can always loosen later.

---

## 3. Lifecycle state semantics (this is the real value)

Write these rules down somewhere visible.

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

This is your legal / compliance safety net.

---

## 4. How lifecycle plugs into the rest of the system

### 4.1 Where this lives

Consistent with earlier decisions:

```
/vibeify/registry/schemas/prompt-lifecycle.schema.v1.json
```

And referenced per prompt:

```yaml
lifecycle:
  status: approved
  reviewedBy: [human]
  approvedBy: "tech-lead"
  lastApprovedAt: "2025-12-16T21:40:00Z"
```

---

### 4.2 CLI behaviour (non-negotiable rules)

| Status     | `vibeify run` | CI | Warning |
| ---------- | ------------- | -- | ------- |
| draft      | ✔️ local only | ❌  | yes     |
| review     | ✔️            | ⚠️ | yes     |
| approved   | ✔️            | ✔️ | no      |
| deprecated | ⚠️            | ❌  | yes     |
| archived   | ❌             | ❌  | n/a     |

This logic belongs in the CLI — **not** in prompts.

---

### 4.3 CI behaviour (simple and brutal)

* CI must **fail fast** if:

  * lifecycle status is invalid
  * status is not `approved`
  * assertions fail

No exceptions. This is how you gain trust.

---

## 5. What is deliberately NOT in v1

Do **not** add these yet:

❌ Jira IDs
❌ Git commit hashes
❌ Owners / teams
❌ Risk levels
❌ Change history

Those are tempting — and wrong for v1.

Lifecycle v1 is about **permission and trust**, nothing else.

---

## 6. Sanity check with your “tell a joke” prompt

```yaml
lifecycle:
  status: approved
  reviewedBy: [human]
  approvedBy: "richard"
  lastApprovedAt: "2025-12-16T21:45:00Z"
```

Yes, even jokes can be approved.
The system doesn’t care *what* the prompt does — only whether it’s governed.

---

## 7. You now have a complete core

You now possess:

1. **PromptInputSchema v1** – what a prompt *is*
2. **PromptOutputSchema v1** – what execution *produces*
3. **PromptOutputAssertions v1** – when output is *acceptable*
4. **PromptLifecycleSchema v1** – when a prompt is *trusted*

This is already more rigorous than most AI platforms.

---

### Next logical step (strong recommendation)

The next artefact that *naturally* follows is:

> **`prompt-lint.rules.v1.yaml`**

Because now you can lint:

* missing lifecycle
* mismatched promptClass vs lifecycle
* missing successCriteria for destructive prompts

If you want, we do that next.
