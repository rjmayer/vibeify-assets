<!--
Simple PR template focused on the project's needs: tests, typechecks, docs and small, testable changes.
Keep PRs small and include a short description of the change and why it matters.
-->

# Summary

Describe the change in 1-2 sentences and the reasoning behind it.

## Checklist

- [ ] I ran the test suite locally: `npm run test` (Jest + ts-jest)
- [ ] Type-check passes locally: `npm run typecheck` (tsc --noEmit)
- [ ] I updated or added unit tests for any changed logic (see `src/solunar/__tests__`)
- [ ] I updated `src/solunar/__tests__` or added tests when changing astronomy/time logic (preserve UTC semantics)
- [ ] I updated `README.md` or relevant docs in `docs/` when adding features or public APIs
- [ ] I included a brief changelog entry (one line) in the PR description
- [ ] Screenshots or recordings attached for UI changes (if applicable)

## Files changed / notes

List the most important files touched and a short note why each was changed.

Example:
- `src/solunar/astro.ts` — adjusted sampling resolution for sunrise; updated tests to assert ordering.

## Testing notes (optional)

Add any manual test steps, environment variables, or setup required to verify the change.

## Links

- Product & onboarding docs: `docs/ONBOARDING.md`
- MVP & feature design: `docs/concept/mvp.md`
- Privacy / Groups: `docs/concept/one-day-maybe.md`
- AI prompts & marketing: `docs/concept/prompts.md`

If you're changing astronomical or time-handling code, please explicitly confirm UTC usage and add a unit test that asserts key invariants (e.g. `sunrise < sunset`).
