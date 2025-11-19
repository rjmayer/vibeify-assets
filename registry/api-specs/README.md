# API Specifications

Place OpenAPI / Swagger / other API specifications in this folder.

Typical usage:

- `user-api.yaml` – public user‑facing HTTP API
- `internal-admin-api.yaml` – internal admin API
- `partner-api.yaml` – partner / B2B API

Prompts can reference these specs via relative paths, for example:

```yaml
context:
  files:
    - registry/api-specs/user-api.yaml
```

AI agents should read these specifications instead of guessing endpoints,
request/response shapes, or error codes.
