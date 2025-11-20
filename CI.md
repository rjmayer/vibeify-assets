# CI (Continuous Integration)

This repository provides a lightweight CI that runs tests and lint for the `vibeify-cli` package.

Key points
- Workflow file: `.github/workflows/ci.yml` (repository-level)
- Triggers: `push` to `main` and `feature/**` (no `pull_request` trigger — single-developer mode)
- Environment: Node.js matrix (20, 24)
 - Required local Node/npm: Use Node.js 20+ (npm 9+) to match CI and package-lock v3
 - Install step: `npm ci --no-audit --no-fund` (runs in `vibeify-cli` working directory)

What to run locally

1. From repository root, change into the CLI folder and install:

```bash
cd vibeify-cli
npm ci
```

2. Run lint and tests:

```bash
npm run lint
npm test
```

Why `npm ci`?
- `npm ci` installs strictly according to `package-lock.json`, ensuring reproducible installations across machines and in CI. We commit `vibeify-cli/package-lock.json` so `npm ci` has a deterministic source.
