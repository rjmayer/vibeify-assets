# 🧩 **Feature → Epic Mapping Template**

*<Replace this subtitle with your project name>*

This template helps convert the **High-level Feature List** into a structured backlog of **Epics**, ensuring every feature has clear delivery scope, acceptance framing, and traceability into future User Stories.

---

## 1. Purpose

*Explain why this mapping exists.*

> This document establishes a clear bridge between high-level product features and actionable Epics used during Requirements Analysis and backlog creation. Each feature from the High-level Feature List is decomposed into one or more Epics, which will later be refined into User Stories with acceptance criteria.

Checklist:

* [ ] Every major feature has at least one Epic
* [ ] The boundaries of each Epic are clear and deliverable
* [ ] No Epic duplicates functionality

---

## 2. Feature → Epic Mapping Table

*Start with a quick “at a glance” overview.*

| Feature ID | Feature Name   | Epic ID(s) | Epic Title(s) | Notes      |
| ---------- | -------------- | ---------- | ------------- | ---------- |
| F1         | <Feature Name> | E1, E2     | <Epic Titles> | <Optional> |
| F2         | <Feature Name> | E3         | <Epic Title>  | <Optional> |
| F3         | <Feature Name> | E4, E5     | <Epic Titles> | <Optional> |

*Tip:*

* *IDs are optional but helpful for maintaining traceability.*
* *If mapping becomes large, split into separate sheets per product area.*

---

## 3. Epic Definitions

*Each Epic from the table above gets a full definition here.*

---

### 🧱 **Epic E<x>: <Epic Title>**

*Repeat for as many Epics as needed.*

#### 3.x.1 Origin Feature(s)

*Which feature(s) does this Epic derive from?*

* F<x> — <Feature Name>
* (Optional: supporting context from Vision Statement)

#### 3.x.2 Epic Description

*A 2–4 sentence explanation of scope and value.*
Example snippet:

> This Epic enables users to perform quick mood check-ins via an emoji-based input flow. It covers UI components, data capture, validation, and local persistence, forming the foundation for analytics and insights features.

#### 3.x.3 Problem / Goal Alignment

*Tie back to the Vision Statement.*
Checklist:

* [ ] Solves part of the main problem?
* [ ] Supports core value proposition?
* [ ] Aligned with target audience needs?

#### 3.x.4 Success Criteria

*How you know the Epic has achieved its purpose.*
Examples:

* Users can complete the workflow end-to-end without errors.
* Data is stored reliably for later retrieval.
* The UI follows design guidelines.

---

### 3.x.5 Included User Stories (Draft)

*Add only high-level story placeholders — details come later.*

Example format:

| Story ID | Story Title                | Description (Draft)                            |
| -------- | -------------------------- | ---------------------------------------------- |
| US1      | User selects initial input | “As a user, I want to choose my mood quickly…” |
| US2      | User adds optional details | …                                              |
| US3      | System saves the check-in  | …                                              |

Tips:

* *Do not write full acceptance criteria yet.*
* *Focus on coverage, not detail.*

---

### 3.x.6 Out of Scope for This Epic

*Prevent accidental bloat.*

Examples:

* Analytics calculations
* Trend visualisation
* Cloud sync
* Notification scheduling

---

### 3.x.7 Dependencies

Examples:

* Requires base navigation infrastructure
* Requires permission handling
* Requires local database schema availability

---

### 3.x.8 Risks / Open Questions

*Capture uncertainties before Sprint Planning.*

Examples:

* “Should offline entries sync automatically once online?”
* “Do we need error recovery screens?”

---

## 4. Backlog Readiness Checklist

*Use before handing Epics to Requirements Analysis.*

* [ ] Every Feature maps to ≥1 Epic
* [ ] Epic descriptions are clear and non-overlapping
* [ ] Scope boundaries are understood
* [ ] Draft story placeholders exist
* [ ] Dependencies identified
* [ ] Out-of-scope items are explicitly listed
* [ ] Open questions have owners



