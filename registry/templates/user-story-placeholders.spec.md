# User Story Template — Placeholder Guide (improved)
This companion document explains every placeholder from registry/templates/user-story-template.md so a junior product owner can correctly populate a story. I updated the "Intent" entries to be more descriptive and actionable, fixed spelling of "recommended", converted the "Good" and "Poor" fields into concrete examples (1–3 real-style examples each), and added tags: mandatory, recommended, optional.

What I did (brief): I expanded the explanation for each placeholder so it describes why a developer or reviewer needs that information and what to include, replaced ambiguous guidance with concrete sample content, and labeled placeholders so teams know what's required for a story to be workable.

What's next: you can copy this file into the repository next to the template, or tell me a branch name and I will prepare a commit/PR for you.

---

## How to read this guide
- Intent: a short, useful explanation of why the information matters and how it will be used by product/engineering.
- Tag: mandatory / recommended / optional — indicates minimum expectation for each story.
- Good: 1–3 concrete examples you could paste into a story.
- Poor: 1–3 concrete examples that are insufficient or misleading.

---

## External Resource Catalog
These placeholders should point to living artifacts your team maintains. Engineers will use these documents to make technical, security, and product decisions.

- {{LINK_PRODUCT_VISION}}  
  - Intent: A single canonical link that explains the long-term goal and target outcomes the product is driving toward so engineers understand the strategic context when making trade-offs. Use a short one-page vision or official roadmap entry.  
  - Tag: recommended  
  - Good:
    - "https://wiki.example.com/product-vision — 'Make listening effortless for commuters; increase weekly retention by 10% by 2026.'"
    - "https://roadmap.company.com/vision#vibeify — Vision snapshot + top metrics"
  - Poor:
    - "https://drive.example.com/slides/random-presentation" (personal draft slide deck)
    - "TBD" or empty link

- {{LINK_EPIC_BRIEF}}  
  - Intent: Link to the epic-level document or issue that gathers related stories, milestones, acceptance criteria, and scope so the story can be traced to larger deliverables.  
  - Tag: mandatory  
  - Good:
    - "https://github.com/org/repo/issues/482 — Epic: Offline Mode MVP (scope, Milestones A/B)"
    - "https://wiki.example.com/epics/offline-mode — Epic brief with timeline"
  - Poor:
    - "https://wiki.example.com/epic-drafts" (generic index with no specific epic)
    - blank

- {{LINK_STRATEGY_OR_OKRS}}  
  - Intent: Show which measurable objective or key result this story contributes to; this helps prioritize and justify trade-offs.  
  - Tag: recommended  
  - Good:
    - "https://okrs.company.com/2025/Q1 — Objective: Increase premium retention; KR: reduce churn by 3%."
    - "OKR: Q2 Streaming Stability — KR: p95 play-start < 200ms"
  - Poor:
    - "No OKR" or "Company goals" (no specific link)
    - "Improve metrics" (no metric)

- {{LINK_USER_RESEARCH_SUMMARY}}  
  - Intent: Provide actual user research findings (interview snippets, usability test outcomes) that justify the story; engineers use this to validate assumptions and acceptance criteria.  
  - Tag: recommended  
  - Good:
    - "https://research.example.com/reports/playlist-offline — 8 interviews; 5/8 said they avoid playlists due to data usage; task success rate 40%."
    - "Research summary: 'Users can't find offline toggle; expect it in playlist header.'"
  - Poor:
    - "Users want this" (no evidence)
    - "Anecdotal feedback from Slack" (no formal notes)

- {{LINK_JOURNEY_MAP}}  
  - Intent: Link to the customer journey or flow that shows where this story fits, highlighting touchpoints, handoffs, and pain points to prevent scope confusion.  
  - Tag: optional  
  - Good:
    - "https://mural.example.com/journey/offline-playback — journey with highlighted pain: 'discoverability of download button'"
  - Poor:
    - "User flow image.png" (unlabeled, no context)
    - missing

- {{LINK_DESIGN_SYSTEM}}  
  - Intent: Pointer to the authoritative design system (components, tokens, variant rules) so engineers implement UI elements that match design and accessibility standards.  
  - Tag: recommended  
  - Good:
    - "https://design.example.com/components/button — Primary button spec (size, token, states) v2.1"
  - Poor:
    - "Screenshot of button" (no tokens, no variant info)
    - "Design system — TBD"

- {{LINK_UI_MOCKS_OR_PROTOTYPE}}  
  - Intent: Direct link to the frames/screens or prototype with frame IDs and notes; engineers will reference exact interactions and spacing. If backend-only, this can be omitted.  
  - Tag: recommended (mandatory if UI changes)  
  - Good:
    - "https://figma.com/file/abcd#node-id=125:20 — Playlist screen; see frame 'Playlist > Download' (annotated)"
    - "https://invision.example.com/proto/123 — click-through prototype, includes microcopy"
  - Poor:
    - "design.png" (single static image with no interaction/context)
    - "TBD"

- {{LINK_COPY_GUIDE_TONE}}  
  - Intent: Link to copy guidelines and preferred messaging for UI text so engineers and content designers use consistent phrasing and legal-safe terms.  
  - Tag: recommended  
  - Good:
    - "https://brand.example.com/copy-guide — tone: friendly, present tense; error copy pattern: 'Action failed — try again.'"
  - Poor:
    - "Write later" or "To be decided"

- {{LINK_API_STANDARDS}}  
  - Intent: Reference to API conventions (HTTP codes, pagination, auth patterns) used by the org so new endpoints conform to existing practices and avoid rework.  
  - Tag: recommended  
  - Good:
    - "https://devdocs.example.com/api-style-guide — use ISO dates, 401 for auth, 403 for authz, consistent pagination"
  - Poor:
    - "No style guide"

- {{LINK_DATA_MODEL_GUIDE}}  
  - Intent: Link to canonical data model docs (ER diagrams, canonical entity definitions) to avoid adding duplicate fields or incompatible types.  
  - Tag: recommended  
  - Good:
    - "https://data.example.com/models/playlist — Playlist entity: id:string, title:string, tracks:[] (refs track.id)"
  - Poor:
    - "Ad hoc spreadsheet" (no authoritative source)

- {{LINK_JSON_SCHEMA_OR_GRAPHQL_SDL}}  
  - Intent: Exact machine-readable contract for requests/responses (JSON Schema or GraphQL SDL) so engineers and QA can validate payloads automatically.  
  - Tag: mandatory (when APIs/data change)  
  - Good:
    - "https://schemas.example.com/v1/playlist-download.json — JSON Schema v1.2"
    - "GraphQL SDL: https://api.example.com/sdl#PlaylistDownload"
  - Poor:
    - Inline bullet list: "returns id, name" (no types or required flags)
    - Missing schema

- {{LINK_NFR_CATALOG}}  
  - Intent: Link to the canonical list of non-functional requirements so the story's NFRs can point to measurable targets rather than vague goals.  
  - Tag: recommended  
  - Good:
    - "https://ops.example.com/nfrs — availability 99.95%, p95 < 300ms for API"
  - Poor:
    - "Make it fast" (no metric)

- {{LINK_SECURITY_POLICY}}  
  - Intent: Link to security requirements (auth, token rotation, encryption) and required scans so developers know required checks before release.  
  - Tag: recommended  
  - Good:
    - "https://sec.example.com/policies/service-auth — OAuth2 + rotation policy; run Snyk + static scan"
  - Poor:
    - "Follow security best practices" (no specifics)

- {{LINK_PRIVACY_GUIDE}} / {{LINK_A11Y_GUIDE}} / {{LINK_PERFORMANCE_GUIDE}} / {{LINK_OBSERVABILITY_GUIDE}}  
  - Intent: Central policy/checklist for privacy, accessibility, performance, and observability to ensure compliance and measurable verification.  
  - Tag: recommended  
  - Good:
    - "A11Y: https://a11y.example.com/checklist — WCAG 2.1 AA, keyboard flows for player"
    - "Performance: p95 < 300ms for playlist endpoints"
  - Poor:
    - "Be accessible" (no acceptance criteria)
    - "Add logs" (no required fields)

- {{LINK_OPERABILITY_RUNBOOK_TEMPLATE}}  
  - Intent: Runbook template and examples so the team knows how to operate and restore the feature in production.  
  - Tag: recommended  
  - Good:
    - "https://runbooks.example.com/templates/service-runbook.md — example runbook 'playlist-service outage' included"
  - Poor:
    - "We'll write the runbook later"

- {{LINK_RELEASE_CHECKLIST}}, {{LINK_TEST_STRATEGY}}, {{LINK_ACCEPTANCE_TEST_SUITE}}, {{LINK_THREAT_MODEL_TEMPLATE}}, {{LINK_RISK_REGISTER}}, {{LINK_COMPLIANCE_GUIDE}}, {{LINK_LOCALIZATION_GUIDE}}, {{LINK_DATA_RETENTION_POLICY}}, {{LINK_ERROR_HANDLING_GUIDE}}, {{LINK_EXPERIMENTATION_GUIDE}}, {{LINK_FEATURE_FLAG_GUIDE}}  
  - Intent: Links to governance artifacts used to verify readiness, legal/regulatory constraints, and rollout rules; include only the directly relevant ones in the story.  
  - Tag: recommended (or mandatory when applicable)  
  - Good:
    - "https://release.example.com/checklists/playlist-release — checklist with step 'run DB migration v2'"
  - Poor:
    - "See company docs" (no pointer to specific checklist or section)

---

## Story Metadata
These items are used for routing, prioritization, and linking the story to code and planning tools.

- {{STORY_ID}}  
  - Intent: A unique identifier that maps this written story to a tracking artifact (issue number or ticket) so developers can find the canonical implementation and history.  
  - Tag: mandatory  
  - Good:
    - "GH-789" or "https://github.com/org/repo/issues/789"
  - Poor:
    - "story-1" (ambiguous) or blank

- {{STORY_TITLE}}  
  - Intent: A concise, actionable title that summarizes the user's goal and the scope; it should be short enough for lists but specific enough to understand intent.  
  - Tag: mandatory  
  - Good:
    - "Allow premium users to download playlists for offline playback"
    - "Show 'download' CTA on playlist header (mobile)"
  - Poor:
    - "Fix playlist stuff"
    - "Make it better"

- {{STORY_TYPE}}  
  - Intent: Categorize the work so planners and reviewers know whether the effort is feature work, investigation (spike), bug fix, or operational chore.  
  - Tag: mandatory  
  - Good:
    - "Feature"
    - "Spike"
    - "Bug"
  - Poor:
    - "Other" or blank

- {{STATUS}}  
  - Intent: Current lifecycle state (e.g., Draft, Ready, In Progress, Blocked, Done) to manage handoffs and to know whether the team can pull it into the sprint.  
  - Tag: mandatory  
  - Good:
    - "Ready for development"
    - "In progress — backend implementation started (PR #150)"
  - Poor:
    - "Maybe" or "Unknown"

- {{EPIC_LINK}}  
  - Intent: A link to the parent epic or initiative that explains broader goals and success metrics so reviewers can assess alignment and scope.  
  - Tag: recommended  
  - Good:
    - "https://github.com/org/repo/issues/480 — Epic: On-device offline features"
  - Poor:
    - "Epic TBD" or omitted when clearly part of an epic

- {{COMPONENT_NAME}}  
  - Intent: The owning code component, service, or UX area so reviewers can assign the right engineers and maintainers.  
  - Tag: mandatory  
  - Good:
    - "playlist-service"
    - "mobile-player (iOS)"
  - Poor:
    - "backend/frontend" (ambiguous)

- {{REPO_URL}}  
  - Intent: Exact code repository (and optionally default branch) where work will be committed, helping new engineers find the codebase quickly.  
  - Tag: recommended  
  - Good:
    - "https://github.com/org/playlist-service (main)"
  - Poor:
    - missing or "repo: internal"

- {{LABELS}}, {{STORY_POINTS}}, {{PRIORITY_OR_WSJF}}, {{RELEASE_OR_SPRINT}}  
  - Intent: Planning metadata to help triage, estimate capacity, and order work; include rationale for priority.  
  - Tag: recommended  
  - Good:
    - "Labels: frontend, mobile, impact-high"
    - "Story points: 5"
    - "Priority: P1 — blocks major onboarding flow"
    - "Target: Sprint 2025-W09"
  - Poor:
    - "Labels: stuff" or arbitrary point "1" without explanation

---

## Narrative
As a / I want / So that and the problem statement steer the team's implementation and acceptance criteria.

- {{USER_ROLE}}  
  - Intent: A specific persona or role (not "users") that clarifies who benefits, including platform and segment when relevant.  
  - Tag: mandatory  
  - Good:
    - "Premium listener on Android (commuter persona)"
    - "Free-tier web user attempting to create playlists"
  - Poor:
    - "Users" (too generic)
    - "Customers?" (vague)

- {{USER_GOAL}}  
  - Intent: Single, concrete user action the story enables — written from the user's perspective, focusing on behavior, not internal implementation.  
  - Tag: mandatory  
  - Good:
    - "save a playlist locally for offline playback"
    - "see an estimated download size before starting"
  - Poor:
    - "improve playlists" (not actionable)

- {{USER_VALUE}}  
  - Intent: The measurable benefit or outcome to the user or business (e.g., reduce steps, save data, increase retention) that justifies the work.  
  - Tag: mandatory  
  - Good:
    - "access favorite songs without cellular data and avoid mobile charges"
    - "reduce playlist abandonment by 20% during onboarding"
  - Poor:
    - "make users happy" (not measurable)

- Job Story parts: {{TRIGGER}}, {{MOTIVATION}}, {{EXPECTED_OUTCOME}}  
  - Intent: Optional alternate format that ties a trigger and context to the desired outcome; useful when behavior depends on specific circumstances.  
  - Tag: optional  
  - Good:
    - Trigger: "When I board the subway with low signal"  
      Motivation: "I want to download my playlist quickly"  
      Expected outcome: "so I can listen uninterrupted while commuting"
  - Poor:
    - Trigger: "Sometimes" (vague)

- {{CURRENT_PAIN}}, {{IMPACT}}, {{SUCCESS_CRITERIA}}  
  - Intent: Explain the problem being solved, quantify the impact where possible, and define measurable success that QA and product can verify.  
  - Tag: mandatory  
  - Good:
    - Current pain: "20% of users drop off during onboarding because downloads fail on cellular."  
      Impact: "Reduced 7-day retention among new users by 4%."  
      Success criteria: "Decrease onboarding drop-off from 20% to <12% within 8 weeks; metrics dashboard shows stable p95 < 500ms for download API."
    - Another success criterion example: "E2E test 'download playlist' passes in CI and is linked to AC"
  - Poor:
    - "Users don't like it" (no metric)
    - "Fix download problems" (no success metric)

---

## Scope
Boundaries prevent accidental expansion of work.

- {{IN_SCOPE_ITEMS}} / {{OUT_OF_SCOPE_ITEMS}}  
  - Intent: Clear, testable list of what will and will not be delivered by this story so implementers and reviewers know the exact target.  
  - Tag: mandatory  
  - Good:
    - In scope: "UI: Add 'Download' button to playlist header (mobile); Backend: new endpoint POST /playlists/:id/download; DB: add playlist.offline_flag"  
    - Out of scope: "Download songs individually; Desktop app support"
  - Poor:
    - "Make downloads better" (too fuzzy)
    - "All devices" (no limitation)

- {{CONSTRAINTS_AND_ASSUMPTIONS}}  
  - Intent: Technical or business constraints and assumptions that affect design choices; include platform versions, third-party limits, or legal constraints.  
  - Tag: recommended  
  - Good:
    - "Assumes we have token-based auth; only Android >= 10 supported initially; uses existing CDN for storage."  
  - Poor:
    - "No constraints" (not helpful)

- {{DEPENDENCIES}}  
  - Intent: External teams, services, or tasks that must complete first (with owners and links) to avoid blocking during implementation.  
  - Tag: mandatory  
  - Good:
    - "Depends on infra: CDN quota increase — PR/issue https://github.com/org/infra/issues/32 (owner: @infra-team, ETA: 2025-02-10)"
    - "Auth lib upgrade PR #214 (owner: @alice)"
  - Poor:
    - "Depends on infra" (no owner, no link)
    - blank

---

## User Research & Design
Context that informs UX decisions and copy.

- {{PERSONA_AND_JOURNEY_LINK}}, {{UX_ARTIFACT_LINKS}}, {{COPY_REQUIREMENTS}}, {{A11Y_LEVEL}}, {{ACCESSIBILITY_CRITICAL_FLOWS}}  
  - Intent: Provide the design artifacts, persona details, and accessibility level that ensure the final implementation meets user needs and compliance requirements. Include specific screens and microcopy.  
  - Tag: recommended (mandatory if UI-facing)  
  - Good:
    - Persona link: "https://research.example.com/personas/commuter — key behaviors: short sessions, intermittent connectivity"  
    - UX artifacts: "Figma frames 'Playlist > Download' + annotation 'show estimated size' (frame 12)"  
    - A11Y: "WCAG 2.1 AA; keyboard focus order: ensure download CTA reachable; screen-reader label: 'Download playlist for offline'"
  - Poor:
    - "Design attached" (no link to canonical file)
    - "Accessible" (no checklist or acceptance criteria)

---

## Acceptance Criteria (BDD/Gherkin)
Must be testable and automatable where possible.

- {{SCENARIO_NAME}}, {{PRECONDITIONS}}, {{ACTION}}, {{EXPECTED_RESULT}}  
  - Intent: Write concrete Given/When/Then scenarios that can be converted into automated tests; include user state, actions, and observable results.  
  - Tag: mandatory  
  - Good:
    - Scenario: "Download playlist success"  
      Given: "a logged-in premium user with 1+ tracks and >= 100MB free storage"  
      When: "the user taps 'Download' on a playlist"  
      Then: "progress indicator shows; playlist status becomes 'Offline'; local files exist and play without network"
    - Scenario: "Download size warning"  
      Given: "user on cellular and estimated size > 50MB"  
      When: "user taps 'Download'"  
      Then: "show confirmation modal 'Use cellular data?'"
  - Poor:
    - "App should download playlists" (not testable)
    - "Make it fast" (non-specific)

- {{SCENARIO_OUTLINE_NAME}}, {{EXAMPLES_TABLE_LINK}}  
  - Intent: Provide parameterized examples to cover permutations (e.g., different account tiers or network conditions).  
  - Tag: recommended  
  - Good:
    - "Examples table: network=wifi/cellular; storage=ok/low; expected=success/failure"
  - Poor:
    - No examples while multiple permutations exist

- {{NEGATIVE_CASES}}  
  - Intent: Explicit failure modes and expected behavior to ensure robustness and graceful degradation.  
  - Tag: mandatory (for customer-impacting flows)  
  - Good:
    - "Network loss mid-download: resume on reconnect; insufficient storage: show 'Not enough space' and cancel"
    - "Auth expiry: request re-auth flow and preserve progress"
  - Poor:
    - "Handle errors" (no cases)

- {{LINK_ACCEPTANCE_TEST_SUITE}}, {{AC_TO_TEST_MAP}}  
  - Intent: Link to automated acceptance tests and map each AC to test cases to ensure traceability.  
  - Tag: recommended  
  - Good:
    - "AC2 -> tests/acceptance/test_download_playlist.py::test_success"
    - "Acceptance suite: https://ci.example.com/jobs/acceptance-playlist"
  - Poor:
    - "We'll add tests later"

---

## Data & API Contracts
Precise contract definitions prevent integration mismatches.

- {{API_ENDPOINTS}}, {{SCHEMA_LINK}}, {{DATA_MODEL_CHANGES}}, {{VALIDATION_RULES}}, {{ERROR_MAPPING}}  
  - Intent: Exact API routes, HTTP methods, sample request/response payloads, schema links, DB changes, and canonical error codes so backend and frontend implementors can integrate without guesswork.  
  - Tag: mandatory (when APIs/data are involved)  
  - Good:
    - API: "POST /v1/playlists/:id/download — Request: { 'quality': 'high' } — Response: { 'jobId': 'abc123', 'status': 'queued' }"  
    - Schema link: "https://schemas.example.com/v1/playlist-download.json"  
    - DB: "Add column playlist.offline_flag BOOLEAN DEFAULT FALSE (migration script: migrations/20251204_add_offline_flag.sql)"
    - Errors: "409 when download already in progress; 413 when not enough storage"
  - Poor:
    - "API will return playlist" (no method, payload, types)
    - "DB change: add flag" (no migration path)

---

## Non-Functional Requirements (NFRs)
Make them measurable and reference the canonical NFR catalog.

- {{AVAILABILITY_TARGET}}, {{PERFORMANCE_SLA}}, {{SCALABILITY_TARGETS}}, {{SECURITY_REQUIREMENTS}}, {{PRIVACY_REQUIREMENTS}}, {{A11Y_REQUIREMENTS}}, {{LOGGING_METRICS_TRACES_REQUIREMENTS}}  
  - Intent: State measurable targets (SLA/SLO, latencies, scaling limits), required security/privacy controls, and what telemetry to emit so the feature can be validated under load and monitored in production.  
  - Tag: mandatory (at minimum reference the NFR catalog)  
  - Good:
    - "Availability: 99.95% for playlist-service (see NFR catalog)"  
    - "Performance: p95 API latency < 300ms; bulk download throughput 2000 req/min"  
    - "Security: tokens must be rotated; encrypt at rest using AES-256 (see security policy)"
    - "Logging: emit request_id, user_id, playlist_id; metric: playlist_download_success_rate"
  - Poor:
    - "Make it fast" (no numbers)
    - "Secure it" (no required checks)

---

## Definition of Ready (DoR) & Definition of Done (DoD)
Checklist items that confirm the story can start and what counts as completion.

- DoR placeholders: {{DOR_CHECK_RESULT}}, {{CAPACITY_CONFIRMATION}}, {{DEPENDENCY_CLEARANCE_STATUS}}, {{REVIEW_STATUS}}  
  - Intent: Evidence that acceptance criteria, designs, dependencies, and team capacity are confirmed before work begins.  
  - Tag: mandatory  
  - Good:
    - "DoR: Accepted (design reviewed 2025-02-01, dependencies cleared: infra PR #32 merged, capacity: 2 devs available in Sprint 9)"
  - Poor:
    - "Ready" (no evidence)

- DoD placeholders: {{CODE_REVIEW_STATUS}}, {{UNIT_TEST_COVERAGE}}, {{INTEGRATION_TEST_STATUS}}, {{E2E_TEST_STATUS}}, {{SEC_PRIV_CHECK_STATUS}}, {{PERF_VERIFICATION_STATUS}}, {{A11Y_VERIFICATION_STATUS}}, {{OBS_IMPLEMENTATION_STATUS}}, {{DOCS_STATUS}}, {{FEATURE_FLAG_STATUS}}, {{RELEASE_CHECKLIST_STATUS}}, {{SIGN_OFF_DETAILS}}  
  - Intent: Concrete exit criteria and artifacts (PR links, coverage %, test run IDs, runbook link, stakeholder sign-off) that demonstrate the story is shippable.  
  - Tag: mandatory (relevant items must be completed)  
  - Good:
    - "Code review: PR #158 merged"  
    - "Unit coverage: 85% on modified modules"  
    - "E2E: CI job acceptance-playlist passed (build 412)"  
    - "Security scan: Snyk no high issues; privacy review completed"  
    - "Docs: README and API docs updated at https://docs.example.com/playlist-download"
  - Poor:
    - "Done when code is merged" (no tests, no verification)

---

## Rollout & Experimentation
Plans to limit blast radius and measure impact.

- {{RELEASE_PLAN_LINK}}, {{MIGRATION_STEPS}}, {{FEATURE_FLAG_NAMES}}, {{EXPERIMENT_HYPOTHESIS}}, {{EXPERIMENT_METRICS}}, {{ROLLBACK_STEPS}}  
  - Intent: Describe phased rollout (canary, % of users), migrations/backfills needed, feature-flagging conventions, experiment hypothesis and success metrics, and exact rollback procedure so launches are safe and measurable.  
  - Tag: recommended (mandatory for user-visible releases)  
  - Good:
    - "Release plan: Canary to 5% (EU first) for 48 hours; expand to 25% if error rate < 0.5%"  
    - "Feature flag: ff.playlist_download.enabled (default: false), rollout via LaunchDarkly"  
    - "Experiment: H0 — enable downloads will increase weekly retention for commuters by 4%; metric: 7-day retention ratio"
    - "Rollback: flip feature flag to false; reverse DB migration using backfill script backfills/undo_download_flag.sql"
  - Poor:
    - "Release to all users" (no plan or rollback)
    - "Rollback: revert code" (no step-by-step)

---

## Testing & Quality
Where tests run, what data to use, and CI gates.

- {{TEST_STRATEGY_LINK}}, {{TEST_DATA_PLAN}}, {{CI_PIPELINE_LINK}}, {{COVERAGE_TARGETS}}, {{ENVIRONMENTS}}  
  - Intent: Where test cases live, what test data is required, CI job names and gates, required coverage thresholds, and target environments for verification.  
  - Tag: recommended  
  - Good:
    - "Test strategy: https://qa.example.com/test-strategy#playlist — unit + integration + E2E in staging"  
    - "CI: acceptance-playlist job, required gate on PR"  
    - "Coverage target: maintain 80% on modified modules"
  - Poor:
    - "We will test later" (no specifics)

---

## Risks, Decisions, and Open Questions
Record decisions and surface unknowns early.

- {{RISKS_LIST}}, {{DECISION_LOG}}, {{OPEN_QUESTIONS}}, {{QUESTION_OWNERS}}, {{QUESTION_DUE_DATES}}  
  - Intent: Enumerate risks (with mitigation), record key decisions (with rationale), and list open questions with owners and target dates so nothing is forgotten.  
  - Tag: mandatory  
  - Good:
    - "Risk: CDN quota may limit downloads — mitigation: request quota increase (owner: @infra, ETA 2025-02-08)."  
    - "Decision: Use existing playlist schema vs new table — decided 2025-01-30 (link to ADR)"
    - "Open Q: Should offline items be encrypted on disk? Owner: @security — due 2025-02-05"
  - Poor:
    - "Risks: TBD"
    - "Questions: none" (when there clearly are unresolved items)

---

## Operational Readiness & References
Make the feature supportable in production.

- {{ALERT_POLICIES}}, {{RUNBOOK_LINK}}, {{SUPPORT_CONTACTS}}, {{SLA_SLO_VALUES}}, {{ISSUE_URL}}, {{RELATED_PR_LINKS}}, {{BRANCH_NAME}}, {{TASK_LIST_LINK}}, {{SECURITY_SCAN_LINK}}  
  - Intent: Links to alerts, runbooks, on-call contacts, SLA/SLO values, issue and PR references, branch names, and automated scan artifacts so ops teams can respond to incidents quickly.  
  - Tag: recommended (mandatory for production-affecting stories)  
  - Good:
    - "Runbook: https://runbooks.example.com/playlist-download#incident — steps to drain queue, restart workers"  
    - "Alerts: playlist-download-error-rate > 1% triggers pager to SRE"  
    - "PRs: https://github.com/org/repo/pull/158 (implementation), branch: feat/playlist-offline"
  - Poor:
    - "Ops will figure it out" (no runbook or alerts)
    - Missing contact info

---

## Usage Notes
- Replace {{LINK_...}} placeholders with living documents and include versioned schema links where applicable.
- Keep NFRs centralized and reference them rather than duplicating text; override only when strictly necessary and state why.
- Acceptance criteria should be testable, traceable, and mapped to automated tests.

---

## Concise Summary Table
A compact checklist you can use while filling the template. This is intentionally concise; refer to the sections above for examples.

| Placeholder | One-line intent | Tag |
|---|---|---:|
| {{LINK_PRODUCT_VISION}} | Strategic context and outcomes to guide trade-offs | recommended |
| {{LINK_EPIC_BRIEF}} | Parent epic with scope and milestones | mandatory |
| {{LINK_STRATEGY_OR_OKRS}} | Which OKR/metric this supports | recommended |
| {{LINK_USER_RESEARCH_SUMMARY}} | Evidence that users need this | recommended |
| {{LINK_JOURNEY_MAP}} | Flow where change occurs | optional |
| {{LINK_DESIGN_SYSTEM}} | Authoritative UI component specs | recommended |
| {{LINK_UI_MOCKS_OR_PROTOTYPE}} | Exact screens/prototype frames for implementation | recommended |
| {{LINK_COPY_GUIDE_TONE}} | Official microcopy and tone guidance | recommended |
| {{LINK_API_STANDARDS}} | API conventions and patterns | recommended |
| {{LINK_DATA_MODEL_GUIDE}} | Canonical data model references | recommended |
| {{LINK_JSON_SCHEMA_OR_GRAPHQL_SDL}} | Machine-readable contract for APIs | mandatory |
| {{LINK_NFR_CATALOG}} | Central NFR targets to reference | recommended |
| {{LINK_SECURITY_POLICY}} | Security controls and checks | recommended |
| {{LINK_PRIVACY_GUIDE}} | Privacy & PII rules | recommended |
| {{LINK_A11Y_GUIDE}} | Accessibility criteria & checks | recommended |
| {{LINK_PERFORMANCE_GUIDE}} | Perf targets and test guidance | recommended |
| {{LINK_OBSERVABILITY_GUIDE}} | Logging/metrics/tracing conventions | recommended |
| {{LINK_OPERABILITY_RUNBOOK_TEMPLATE}} | Runbook templates and examples | recommended |
| {{LINK_RELEASE_CHECKLIST}} | Release gates/steps to follow | recommended |
| {{LINK_TEST_STRATEGY}} | Test approach and gating | recommended |
| {{LINK_ACCEPTANCE_TEST_SUITE}} | Acceptance test harness link | recommended |
| {{LINK_THREAT_MODEL_TEMPLATE}} | Threat model template link | recommended |
| {{LINK_RISK_REGISTER}} | Risk log link | recommended |
| {{LINK_COMPLIANCE_GUIDE}} | Regulatory/compliance guidance | recommended |
| {{LINK_LOCALIZATION_GUIDE}} | i18n/l10n rules | optional |
| {{LINK_DATA_RETENTION_POLICY}} | Data retention rules | recommended |
| {{LINK_ERROR_HANDLING_GUIDE}} | Error semantics & codes | recommended |
| {{LINK_EXPERIMENTATION_GUIDE}} | A/B testing guidelines | recommended |
| {{LINK_FEATURE_FLAG_GUIDE}} | Feature flag practices | recommended |
| {{STORY_ID}} | Unique tracking identifier (issue/PR) | mandatory |
| {{STORY_TITLE}} | Short descriptive name for the story | mandatory |
| {{STORY_TYPE}} | Feature/Spike/Bug/Chore classification | mandatory |
| {{STATUS}} | Current lifecycle state | mandatory |
| {{EPIC_LINK}} | Parent epic/initiative link | recommended |
| {{COMPONENT_NAME}} | Owning service/component | mandatory |
| {{REPO_URL}} | Code repo and default branch | recommended |
| {{LABELS}} | Tracking labels and tags | recommended |
| {{STORY_POINTS}} | Size estimate | recommended |
| {{PRIORITY_OR_WSJF}} | Priority / WSJF score and rationale | recommended |
| {{RELEASE_OR_SPRINT}} | Planned release or sprint | recommended |
| {{USER_ROLE}} | Specific persona / platform / segment | mandatory |
| {{USER_GOAL}} | Single user action enabled | mandatory |
| {{USER_VALUE}} | Benefit/outcome for user or business | mandatory |
| {{TRIGGER}} / {{MOTIVATION}} / {{EXPECTED_OUTCOME}} | Optional job-story parts | optional |
| {{CURRENT_PAIN}} / {{IMPACT}} / {{SUCCESS_CRITERIA}} | Problem, impact, measurable success | mandatory |
| {{IN_SCOPE_ITEMS}} / {{OUT_OF_SCOPE_ITEMS}} | Clear scope boundaries | mandatory |
| {{CONSTRAINTS_AND_ASSUMPTIONS}} | Known constraints/assumptions | recommended |
| {{DEPENDENCIES}} | Blockers with owners and links | mandatory |
| {{PERSONA_AND_JOURNEY_LINK}} | Persona + journey links | recommended |
| {{UX_ARTIFACT_LINKS}} | Wireframes/mocks/prototypes | recommended |
| {{COPY_REQUIREMENTS}} | Microcopy and localization notes | recommended |
| {{A11Y_LEVEL}} / {{ACCESSIBILITY_CRITICAL_FLOWS}} | Accessibility level & flows | recommended |
| {{SCENARIO_NAME}} / {{PRECONDITIONS}} / {{ACTION}} / {{EXPECTED_RESULT}} | Gherkin acceptance criteria | mandatory |
| {{SCENARIO_OUTLINE_NAME}} / {{EXAMPLES_TABLE_LINK}} | Parameterized test examples | recommended |
| {{NEGATIVE_CASES}} | Edge/failure cases to test | mandatory |
| {{LINK_ACCEPTANCE_TEST_SUITE}} / {{AC_TO_TEST_MAP}} | Test mapping & suite link | recommended |
| {{API_ENDPOINTS}} / {{SCHEMA_LINK}} / {{DATA_MODEL_CHANGES}} | API & data contract details | mandatory |
| {{VALIDATION_RULES}} / {{ERROR_MAPPING}} | Validation and error codes | recommended |
| {{AVAILABILITY_TARGET}} / {{PERFORMANCE_SLA}} / {{SCALABILITY_TARGETS}} | NFR metrics & targets | mandatory |
| {{SECURITY_REQUIREMENTS}} / {{PRIVACY_REQUIREMENTS}} | Security & privacy controls | recommended |
| {{LOGGING_METRICS_TRACES_REQUIREMENTS}} | Observability requirements | recommended |
| {{DOR_CHECK_RESULT}} / {{CAPACITY_CONFIRMATION}} / {{DEPENDENCY_CLEARANCE_STATUS}} | DoR evidence | mandatory |
| {{CODE_REVIEW_STATUS}} / {{UNIT_TEST_COVERAGE}} / {{INTEGRATION_TEST_STATUS}} / {{E2E_TEST_STATUS}} | DoD evidence | mandatory |
| {{SEC_PRIV_CHECK_STATUS}} / {{PERF_VERIFICATION_STATUS}} / {{A11Y_VERIFICATION_STATUS}} | Cross-cutting verification | recommended |
| {{OBS_IMPLEMENTATION_STATUS}} / {{DOCS_STATUS}} / {{FEATURE_FLAG_STATUS}} / {{RELEASE_CHECKLIST_STATUS}} | Release readiness items | recommended |
| {{RELEASE_PLAN_LINK}} / {{MIGRATION_STEPS}} / {{FEATURE_FLAG_NAMES}} | Rollout & migration plan | recommended |
| {{EXPERIMENT_HYPOTHESIS}} / {{EXPERIMENT_METRICS}} | Experiment definition & metrics | recommended |
| {{ROLLBACK_STEPS}} / {{DATA_ROLLBACK_STEPS}} | Rollback & data rollback plan | mandatory (if product/data-affecting) |
| {{TEST_STRATEGY_LINK}} / {{TEST_DATA_PLAN}} / {{CI_PIPELINE_LINK}} | Testing & CI references | recommended |
| {{RISKS_LIST}} / {{DECISION_LOG}} / {{OPEN_QUESTIONS}} | Risks, decisions, open questions | mandatory |
| {{RUNBOOK_LINK}} / {{ALERT_POLICIES}} / {{SUPPORT_CONTACTS}} | Operational runbook and alerts | recommended |
| {{ISSUE_URL}} / {{RELATED_PR_LINKS}} / {{BRANCH_NAME}} / {{TASK_LIST_LINK}} | GitHub artifacts & branches | mandatory |
| {{SECURITY_SCAN_LINK}} / {{PERF_TEST_PIPELINE_LINK}} / {{A11Y_TEST_PIPELINE_LINK}} | Automation hooks & scan links | recommended |

---

If you'd like, I can commit this file to a branch and open a PR. Tell me the branch name you'd like used and I will prepare the commit.