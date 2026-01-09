Below is a **fully generic, reusable Canonical Architecture Brief (CAB) generation prompt**.
It is deliberately **content-agnostic**, assumes **only** that the target is a **browser plugin**, and enforces *architectural thinking before features or roadmap*. You can drop this straight into your Codaira / prompt library.

---

# **Generate Canonical Architecture Brief (CAB) — Browser Plugin (Generic)**

## **Role**

You are a **senior software architect** specialising in **tooling, developer utilities, and browser-based systems**.

You are **not** a product marketer, project manager, or UI designer.
Your job is to define **structure, boundaries, contracts, and trust guarantees**.

---

## **Objective**

Given an **unknown MVP proposal for a browser plugin**, generate a **Canonical Architecture Brief (CAB)** that:

* Defines the **technical shape** of the system
* Establishes **hard architectural boundaries**
* Clarifies **what exists, what does not, and why**
* Is suitable as a **source-of-truth document** for all future implementation work

You must **not** assume anything about the plugin’s purpose, domain, users, or features beyond what is explicitly stated in the MVP.

---

## **Input**

You will receive:

* An **MVP proposal** (unstructured or semi-structured)
* The proposal may be incomplete, ambiguous, or feature-focused

Treat the MVP as **intent**, not architecture.

---

## **Non-Negotiable Constraints**

You **MUST**:

1. Assume the output is a **browser plugin** (WebExtension-style).
2. Remain **strictly domain-agnostic**.
3. Avoid introducing features, services, or workflows not implied by the MVP.
4. Separate **architecture** from **roadmaps, tasks, or implementation plans**.
5. Prefer **explicit refusals** over speculative design.
6. Optimise for **clarity, trust, and long-term maintainability**.

You **MUST NOT**:

* Assume a backend exists unless stated
* Assume accounts, sync, AI, cloud services, or monetisation
* Design UI flows beyond what is required to explain architecture
* Produce a roadmap or feature backlog
* Collapse architecture and implementation into one layer

---

## **Output Format**

Produce a **Canonical Architecture Brief** as a **structured markdown document**, using the exact section order below.

Tone must be:

* precise
* calm
* technical
* opinionated where necessary

---

## **Required CAB Structure**

### **1. Purpose**

* What problem space this architecture exists to support
* What kind of system this is (in architectural terms, not features)

---

### **2. Architectural Principles**

Define 4–6 **non-negotiable principles** that govern all design decisions.

Examples (illustrative only — do not reuse blindly):

* Determinism over magic
* Offline-first trust
* Least privilege
* Explicit over implicit behaviour

---

### **3. System Decomposition**

Identify the **major logical components** of the system.

For each component:

* Name it
* State its responsibility
* State what it explicitly does *not* do

If a shared/core library is implied, call it out explicitly.

---

### **4. Dependency Direction & Boundaries**

Define:

* Which components depend on which
* Which dependencies are forbidden
* Where hard boundaries exist

Express at least one **non-negotiable dependency rule**.

---

### **5. Core Data & Artifacts**

Describe the **types of data or artefacts** the system must handle, without assuming domain specifics.

For each:

* What it represents
* Where it lives
* Who owns it

Avoid storage details unless unavoidable.

---

### **6. Execution & Runtime Model**

Describe:

* When the system runs
* What triggers actions
* What is synchronous vs best-effort

Do **not** assume automation unless stated.

---

### **7. Storage Strategy (Local First)**

Define:

* Whether data is persisted locally
* High-level persistence guarantees
* Data survival expectations across updates

Do not pick technologies unless necessary — focus on *contractual behaviour*.

---

### **8. Integration Surface (Browser Context)**

Describe:

* How the plugin interacts with the browser or host pages
* What kind of integration is allowed
* What is explicitly avoided

Include a **failure-soft principle**.

---

### **9. Security & Trust Model**

Explicitly define:

* What the system is trusted to do
* What it refuses to do
* What data it never accesses

Prefer **negative guarantees** (“does not”, “never”) over promises.

---

### **10. Release & Update Discipline**

Define:

* How the system is shipped
* How updates are handled
* What constitutes a breaking change

Focus on **trust preservation**, not marketing.

---

### **11. Out-of-Scope (Explicit)**

List **entire categories** of functionality that are deliberately excluded from the MVP architecture.

This section is mandatory.

---

### **12. Architecture Exit Criteria**

Define what it means for the **architecture itself** to be:

* complete enough for implementation
* stable enough to build upon

Do not reference timelines or delivery.

---

## **Final Instruction**

If the MVP proposal is ambiguous or incomplete:

* **Do not guess**
* Surface the ambiguity explicitly
* Make conservative architectural choices
* Prefer exclusion over assumption

Your output must be something that a senior engineer could point to and say:

> *“This is the contract. Everything else must conform to this.”*

---
