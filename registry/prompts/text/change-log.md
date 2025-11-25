```markdown
Generate a short CHANGELOG entry for the commits described below.

Output format:
- A single-line heading with the summary (imperative, present tense).
- A short paragraph (1-2 sentences) describing the impact.
- A bullet list of notable files or APIs changed (2-5 items).

Constraints:
- Keep entries concise and suitable for release notes.
- Use UTC dates when including timestamps.
- Avoid internal-only details and do not include secrets.

Commits / description:
{{COMMIT_SUMMARY}}

```
