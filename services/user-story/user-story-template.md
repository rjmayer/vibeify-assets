User Story Template (with external resource augmentation)

External Resource Catalog (link placeholders)
- {{LINK_PRODUCT_VISION}}
- {{LINK_EPIC_BRIEF}}
- {{LINK_STRATEGY_OR_OKRS}}
- {{LINK_USER_RESEARCH_SUMMARY}}
- {{LINK_JOURNEY_MAP}}
- {{LINK_DESIGN_SYSTEM}}
- {{LINK_UI_MOCKS_OR_PROTOTYPE}}
- {{LINK_COPY_GUIDE_TONE}}
- {{LINK_API_STANDARDS}}
- {{LINK_DATA_MODEL_GUIDE}}
- {{LINK_JSON_SCHEMA_OR_GRAPHQL_SDL}}
- {{LINK_NFR_CATALOG}}
- {{LINK_SECURITY_POLICY}}
- {{LINK_PRIVACY_GUIDE}}
- {{LINK_A11Y_GUIDE}}
- {{LINK_PERFORMANCE_GUIDE}}
- {{LINK_OBSERVABILITY_GUIDE}}
- {{LINK_OPERABILITY_RUNBOOK_TEMPLATE}}
- {{LINK_RELEASE_CHECKLIST}}
- {{LINK_TEST_STRATEGY}}
- {{LINK_ACCEPTANCE_TEST_SUITE}}
- {{LINK_THREAT_MODEL_TEMPLATE}}
- {{LINK_RISK_REGISTER}}
- {{LINK_COMPLIANCE_GUIDE}}
- {{LINK_LOCALIZATION_GUIDE}}
- {{LINK_DATA_RETENTION_POLICY}}
- {{LINK_ERROR_HANDLING_GUIDE}}
- {{LINK_EXPERIMENTATION_GUIDE}}
- {{LINK_FEATURE_FLAG_GUIDE}}

Story Metadata
- Story ID: {{STORY_ID}}
- Title: {{STORY_TITLE}}
- Type: {{STORY_TYPE}} (e.g., Feature, Spike, Bug)
- Status: {{STATUS}}
- Epic: {{EPIC_LINK}} (see {{LINK_EPIC_BRIEF}})
- Component/Service: {{COMPONENT_NAME}}
- Repository: {{REPO_URL}}
- Labels/Tags: {{LABELS}}
- Story Points: {{STORY_POINTS}}
- Priority/WSJF: {{PRIORITY_OR_WSJF}}
- Target Release/Sprint: {{RELEASE_OR_SPRINT}}

Narrative
- As a: {{USER_ROLE}}
- I want: {{USER_GOAL}}
- So that: {{USER_VALUE}}
- Job Story (optional): When {{TRIGGER}}, I want {{MOTIVATION}}, so I can {{EXPECTED_OUTCOME}}.
- Problem Statement: Because {{CURRENT_PAIN}}, users experience {{IMPACT}}; success looks like {{SUCCESS_CRITERIA}}.

Scope
- In Scope: {{IN_SCOPE_ITEMS}}
- Out of Scope: {{OUT_OF_SCOPE_ITEMS}}
- Constraints/Assumptions: {{CONSTRAINTS_AND_ASSUMPTIONS}} (align with {{LINK_COMPLIANCE_GUIDE}} and {{LINK_DATA_RETENTION_POLICY}})
- Dependencies: {{DEPENDENCIES}} (upstream/downstream systems, teams; link issues/PRs)

User Research & Design
- Personas/Journey: {{PERSONA_AND_JOURNEY_LINK}} (see {{LINK_USER_RESEARCH_SUMMARY}} and {{LINK_JOURNEY_MAP}})
- UX Artifacts: {{UX_ARTIFACT_LINKS}} (wireframes/mocks/prototype; see {{LINK_DESIGN_SYSTEM}} and {{LINK_UI_MOCKS_OR_PROTOTYPE}})
- Content/Copy: {{COPY_REQUIREMENTS}} (tone/style via {{LINK_COPY_GUIDE_TONE}})
- Accessibility: adhere to {{A11Y_LEVEL}} per {{LINK_A11Y_GUIDE}}; critical flows: {{ACCESSIBILITY_CRITICAL_FLOWS}}

Acceptance Criteria (BDD/Gherkin)
- Scenario: {{SCENARIO_NAME}}
  Given {{PRECONDITIONS}}
  When {{ACTION}}
  Then {{EXPECTED_RESULT}}
- Scenario Outline: {{SCENARIO_OUTLINE_NAME}}
  Examples: {{EXAMPLES_TABLE_LINK}}
- Negative/Edge Cases: {{NEGATIVE_CASES}}
- Reference acceptance suite: {{LINK_ACCEPTANCE_TEST_SUITE}}
- Traceability: map AC to tests: {{AC_TO_TEST_MAP}}

Data & API Contracts
- API Endpoints: {{API_ENDPOINTS}} (conform to {{LINK_API_STANDARDS}})
- Request/Response Schemas: {{SCHEMA_LINK}} (JSON Schema/GraphQL SDL via {{LINK_JSON_SCHEMA_OR_GRAPHQL_SDL}})
- Data Model Changes: {{DATA_MODEL_CHANGES}} (reference {{LINK_DATA_MODEL_GUIDE}})
- Validation Rules: {{VALIDATION_RULES}}
- Error Handling: {{ERROR_MAPPING}} aligned with {{LINK_ERROR_HANDLING_GUIDE}}

Non-Functional Requirements (augment with external guidelines)
- Availability/Uptime: {{AVAILABILITY_TARGET}} (source: {{LINK_NFR_CATALOG}})
  Verification: {{AVAILABILITY_TESTS_OR_MONITORING}}
- Performance/Latency: {{PERFORMANCE_SLA}} (source: {{LINK_PERFORMANCE_GUIDE}})
  Load profile: {{LOAD_PROFILE}}; Verification: {{PERF_TEST_PLAN_LINK}}
- Scalability: {{SCALABILITY_TARGETS}} (source: {{LINK_NFR_CATALOG}})
- Security: {{SECURITY_REQUIREMENTS}} (authz/authn, secrets, encryption) per {{LINK_SECURITY_POLICY}}
  Threat Model: {{THREAT_MODEL_LINK}} using {{LINK_THREAT_MODEL_TEMPLATE}}
- Privacy/Data Protection: {{PRIVACY_REQUIREMENTS}} (PII, consent, data minimization) per {{LINK_PRIVACY_GUIDE}} and {{LINK_DATA_RETENTION_POLICY}}
- Accessibility: {{A11Y_REQUIREMENTS}} per {{LINK_A11Y_GUIDE}}
- Observability: {{LOGGING_METRICS_TRACES_REQUIREMENTS}} per {{LINK_OBSERVABILITY_GUIDE}}
  Dashboards/Alerts: {{OBS_DASHBOARD_LINKS}}
- Operability/Supportability: {{OPERATIONS_REQUIREMENTS}} (health checks, runbook) per {{LINK_OPERABILITY_RUNBOOK_TEMPLATE}}
- Maintainability: {{MAINTAINABILITY_CRITERIA}} (code standards, modularity)
- Compliance/Regulatory: {{COMPLIANCE_REQUIREMENTS}} per {{LINK_COMPLIANCE_GUIDE}}
- Localization/i18n: {{LOCALIZATION_REQUIREMENTS}} per {{LINK_LOCALIZATION_GUIDE}}

Definition of Ready (DoR)
- Meets DoR checklist: {{DOR_CHECK_RESULT}} (see {{LINK_DOR_CHECKLIST}})
- Team capacity confirmed: {{CAPACITY_CONFIRMATION}}
- Dependencies cleared: {{DEPENDENCY_CLEARANCE_STATUS}}
- Designs and AC reviewed: {{REVIEW_STATUS}}

Definition of Done (DoD)
- Code complete and peer reviewed: {{CODE_REVIEW_STATUS}}
- Tests: unit {{UNIT_TEST_COVERAGE}}, integration {{INTEGRATION_TEST_STATUS}}, e2e {{E2E_TEST_STATUS}} (see {{LINK_TEST_STRATEGY}})
- Security/privacy checks passed: {{SEC_PRIV_CHECK_STATUS}} (linting/scans per {{LINK_SECURITY_POLICY}})
- Performance and accessibility verified: {{PERF_VERIFICATION_STATUS}}, {{A11Y_VERIFICATION_STATUS}}
- Observability implemented: {{OBS_IMPLEMENTATION_STATUS}} with dashboards {{OBS_DASHBOARD_LINKS}}
- Documentation updated: {{DOCS_STATUS}} (README/API docs/runbook)
- Feature flags/rollout configured: {{FEATURE_FLAG_STATUS}} (see {{LINK_FEATURE_FLAG_GUIDE}})
- Release checklist completed: {{RELEASE_CHECKLIST_STATUS}} (see {{LINK_RELEASE_CHECKLIST}})
- Stakeholder sign-off: {{SIGN_OFF_DETAILS}}

Rollout & Experimentation
- Release Plan: {{RELEASE_PLAN_LINK}} (phased/canary/blue-green)
- Migration/Backfill: {{MIGRATION_STEPS}}
- Feature Flags: {{FEATURE_FLAG_NAMES}} and default states
- Experiment Design: {{EXPERIMENT_HYPOTHESIS}} with metrics {{EXPERIMENT_METRICS}} per {{LINK_EXPERIMENTATION_GUIDE}}
- Rollback Plan: {{ROLLBACK_STEPS}}; Data rollback: {{DATA_ROLLBACK_STEPS}}

Testing & Quality
- Test Strategy: {{TEST_STRATEGY_LINK}} (unit/integration/e2e/perf/a11y/security)
- Test Data: {{TEST_DATA_PLAN}}
- CI/CD: {{CI_PIPELINE_LINK}} with gates {{PIPELINE_GATES}}
- Coverage Targets: {{COVERAGE_TARGETS}}
- Non-Prod Environments: {{ENVIRONMENTS}} and access {{ENV_ACCESS_DETAILS}}

Risks, Decisions, and Open Questions
- Risks: {{RISKS_LIST}} (mitigations in {{RISK_MITIGATION_LINK}} referencing {{LINK_RISK_REGISTER}})
- Decisions: {{DECISION_LOG}} (link architectural decisions record)
- Open Questions: {{OPEN_QUESTIONS}} with owners {{QUESTION_OWNERS}} and due dates {{QUESTION_DUE_DATES}}

Operational Readiness
- Monitoring/Alerting: {{ALERT_POLICIES}} per {{LINK_OBSERVABILITY_GUIDE}}
- Runbook: {{RUNBOOK_LINK}} via {{LINK_OPERABILITY_RUNBOOK_TEMPLATE}}
- On-call/Support: {{SUPPORT_CONTACTS}} and escalation {{ESCALATION_PATH}}
- SLA/SLO: {{SLA_SLO_VALUES}} and error budget {{ERROR_BUDGET_POLICY}}

References to GitHub Artifacts
- Issue: {{ISSUE_URL}}
- Related PRs: {{RELATED_PR_LINKS}}
- Branch/Env: {{BRANCH_NAME}} / {{DEPLOY_ENV}}
- Task Breakdown: {{TASK_LIST_LINK}}
- Automation Hooks: {{SECURITY_SCAN_LINK}}, {{PERF_TEST_PIPELINE_LINK}}, {{A11Y_TEST_PIPELINE_LINK}}

Usage Notes
- Replace each {{LINK_...}} placeholder with a living document or catalog that your team maintains; if a resource doesn’t exist, create it using the referenced templates and assign an owner.
- Keep NFRs centralized in {{LINK_NFR_CATALOG}} and reference them here rather than duplicating text. Only override locally when the story requires stricter targets.
- Ensure contracts (schemas, SDL) are versioned and linked; acceptance criteria must be testable and traceable to automated tests.
- Review this template during backlog refinement to satisfy Definition of Ready; validate during sprint review against Definition of Done.
