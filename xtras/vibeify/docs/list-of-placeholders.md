## Summary of placeholders usednin templates.

### generate-meta-prompt.md

These are the placeholder names, with example

- AGENT_TYPE: 
 - coding agent
- PRIMARY_TASKS:
  - status review for “playlist” microservice
  - generate DB migration adding “curation_tags”
  - refactor read/write paths in playlist service
  - update tests
  - produce changelog and commit message
  - dependency impact analysis
- CONSTRAINTS:
  - style: Python PEP 8/black, TypeScript eslint
  - schema validation for Kubernetes; idempotent migrations
  - no external network calls
  - time budget 20 minutes; fail fast
  - 2 GB memory; avoid O(n^2) on files >5 MB
- CONTEXT_REFERENCES:
  - /vibeify/registry/onboarding.md
  - /vibeify/services/playlist/context/*.yaml
  - /vibeify/registry/guidelines/style.md
  - /vibeify/registry/guidelines/conventional-commits.md
  - /vibeify/services/playlist/README.md
  - /vibeify/services/playlist/migrations/
  - /vibeify/services/playlist/src/
  - /vibeify/services/playlist/tests/
- OUTPUT_SPEC:
  - Part 1: Markdown report with timestamp + version
  - Part 2: unified diff patch only
- OPTIONAL_BEHAVIOUR:
  - performance hints
  - complexity warnings
  - suggestions for further prompts