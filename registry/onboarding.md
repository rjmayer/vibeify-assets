# Project Onboarding (Vibeify)

> This file is copied into each host project as the **entry point for AI agents**.
> Replace the placeholder sections with your real project information.

---

## 1. Project Overview

- **Project Name:** _<Your Project Name>_
- **Domain:** _e.g. FinTech, Productivity, Internal Tool_
- **Primary Users:** _e.g. Customers, Internal Staff, Admins_
- **High‑level Goal:**  
  _One or two sentences describing what success looks like._

### Short Summary (for AI agents)

This repository uses **Vibeify** to treat prompts as first‑class artifacts.
Prompts live under `/vibeify/services`, shared context under `/vibeify/registry`,
and generated outputs under `/vibeify/outbox`. The AI should always prefer
**reading existing context** over guessing, and always produce outputs that
are easy for humans to review, test, and maintain.

---

## 2. Architecture – High Level

_Replace with a short description of your architecture._ For example:

- Backend: _e.g. Node.js + PostgreSQL_
- Frontend: _e.g. React / React Native_
- Integrations: _e.g. Stripe, SendGrid, internal REST APIs_

If you maintain specific architecture docs, link them here:

- `/docs/architecture.md`
- `/vibeify/registry/api-specs/*.yaml`

---

## 3. Vibeify Layout in This Project

- `/vibeify/registry` – global project context (this file, styleguide, API specs)
- `/vibeify/services/*/prompts` – individual prompts grouped by service/domain
- `/vibeify/services/*/context` – domain‑specific context files
- `/vibeify/inbox` – rough prompt drafts generated from issues / tickets
- `/vibeify/outbox` – AI outputs to be reviewed and merged into the main code
- `/vibeify/prompt-tests` – validation and semantic tests for prompts

AI agents should **never** assume the structure; always inspect the actual
tree and the files present.

---

## 4. How AI Should Behave in This Project

1. **Respect the styleguide**  
   Always follow `/vibeify/registry/styleguide.md` for code style, naming,
   and communication tone.

2. **Prefer small, reviewable changes**  
   Generate focused outputs that can reasonably fit in a single PR or patch.

3. **Annotate decisions**  
   When generating code or designs, briefly explain non‑obvious decisions,
   trade‑offs, or assumptions.

4. **Don’t fabricate external facts**  
   If something depends on external systems (APIs, services, tickets), and
   the details are not present in this repository, the AI should clearly
   mark them as assumptions or suggest follow‑up questions.

5. **Keep security in mind**  
   Do not log secrets, keys, or personal data. Avoid suggesting patterns
   that conflict with common security best practices.

---

## 5. Typical Flow with Vibeify

1. A human or automation creates a ticket (e.g. in Jira).
2. A prompt draft is generated into `/vibeify/inbox` (raw markdown).
3. A developer refines that draft into a proper prompt YAML under
   `/vibeify/services/<service>/prompts/` using the schema in
   `registry/prompt-schema.json`.
4. The tests in `/vibeify/prompt-tests` are run locally and in CI.
5. Once the prompt is stable, AI agents use it via the Vibeify CLI or other tooling.

---

## 6. Customisation Checklist

After bootstrapping Vibeify, you should:

- [ ] Replace this onboarding note with project‑specific details.
- [ ] Fill out `styleguide.md` with your code and prompt conventions.
- [ ] Add API specifications under `api-specs/` if relevant.
- [ ] Replace the `services/example` prompts with your own services.
- [ ] Add prompt test cases tailored to your domain.
