# Template Resolution Implementation

This directory contains the complete implementation of the Vibeify template resolution system as specified in the forge documentation.

## Quick Start

```javascript
const { resolveTemplate } = require('./tools/template-resolver.js');

// Resolve a template with or without inheritance
const resolved = resolveTemplate('path/to/template.yaml');

// Use the resolved template for schema derivation, rendering, etc.
```

## Running Tests

```bash
# Run all 36 conformance tests
npm run test:templates
```

Expected output:
```
📊 Results: 36 passed, 0 failed
```

## Documentation

- **[Usage Guide](./template-resolution-usage.md)** - Complete API and best practices
- **[Examples](./template-resolution-example.md)** - Step-by-step walkthrough
- **Specification Docs** (in `/forge`):
  - `TemplateResolutionAlgorithm.md` - Canonical algorithm
  - `TemplateResolutionAndInheritanceRequirements.md` - Normative requirements
  - `TemplateResolutionConformanceTests.md` - Test specifications
  - `TemplateResolution-FullExample.md` - Worked example

## Implementation

### Core Module

**`tools/template-resolver.js`**
- Implements the canonical 7-phase resolution algorithm
- Supports only canonical `extends: <string>` inheritance syntax (v1 conformant)
- Comprehensive error handling with specific error categories
- Deterministic and auditable resolution

Key functions:
- `resolveTemplate(templateRef, baseDir)` - Main resolution function
- `safeResolveTemplate(templateRef, baseDir)` - Non-throwing variant
- `TemplateResolutionError` - Error class with category support

### Test Suite

**`prompt-tests/template-resolution.test.js`**
- 36 REQUIRED conformance tests covering all categories
- Simple test framework with clear pass/fail output
- Comprehensive coverage of all error conditions

Test categories:
- **A**: Basic Resolution (2 tests)
- **B**: Determinism (2 tests)
- **C**: Inheritance Graph Validation (3 tests)
- **D**: Placeholder Rules (5 tests)
- **E**: Section Rules (4 tests)
- **F**: Schema Derivability (2 tests)
- **G**: Boundary Enforcement (3 tests)
- **H**: Flattening Guarantees (2 tests)
- **I**: Failure Semantics (2 tests)
- **J**: V1 Conformance (11 tests)

### Test Fixtures

**`prompt-tests/fixtures/templates/`**
- Base templates without inheritance
- Parent-child template pairs
- Error condition templates (circular, type conflicts, etc.)
- All scenarios from conformance test spec

## Architecture

```
Template Resolution Pipeline:

1. Load Template ────────────► Phase 0: Pre-Validation
                                ↓
2. Build Chain ──────────────► Phase 1: Build Inheritance Chain
                                ↓
3. Linearize ────────────────► Phase 2: Linearization
                                ↓
4. Merge ────────────────────► Phase 4: Merge Templates
                                ↓
5. Validate ─────────────────► Phase 5: Post-Merge Validation
                                ↓
6. Finalize ─────────────────► Phase 6: Finalization
                                ↓
7. Return ───────────────────► Resolved Template (no inheritance metadata)
```

## Key Guarantees

1. **Determinism**: Same input → same output
2. **Completeness**: All placeholders and sections explicitly defined
3. **Schema-Derivability**: Exactly one valid input schema can be derived
4. **Boundary Integrity**: No execution/governance metadata leakage
5. **Transparency**: Downstream systems cannot distinguish inherited templates
6. **Auditability**: Clear error messages with categories and references

## Error Categories

| Category | Description |
|----------|-------------|
| `TEMPLATE_NOT_FOUND` | Template file doesn't exist |
| `CIRCULAR_INHERITANCE` | Circular dependency detected |
| `UNSUPPORTED_INHERITANCE_KEY` | Template uses `inherits` or `parentRef` instead of `extends` |
| `INVALID_EXTENDS_TYPE` | Template `extends` is not a string (e.g., object or other type) |
| `EMPTY_EXTENDS_VALUE` | Template `extends` is an empty string |
| `UNKNOWN_FIELD` | Template contains top-level key not in allowlist |
| `TYPE_CONFLICT` | Incompatible type change in redeclaration |
| `CONSTRAINT_WEAKENING` | Required → optional not allowed |
| `MISSING_TYPE` | Placeholder missing required type field |
| `INVALID_TEMPLATE` | Malformed template structure |
| `LOAD_ERROR` | Failed to load or parse template |

## Compliance

This implementation is **fully v1 compliant** with:

- ✅ Vibeify Prompt Architecture (Section 1.8)
- ✅ Template Resolution Algorithm (7 phases)
- ✅ Template Resolution Requirements (all MUST/MUST NOT clauses)
- ✅ Conformance Tests (36/36 REQUIRED tests)
- ✅ Content-only template surface (no `context`, `schemas`, or `developer_controls` fields)
- ✅ Canonical inheritance syntax only (`extends: <string>`)

## Template Structure (v1)

Templates must contain **only** the following top-level keys:

- **`metadata`** - Template identification and description
- **`placeholders`** - Input contract (authoritative)
- **`template`** - Prompt sections and content structure
- **`extends`** - Parent template reference (string only)

**Forbidden fields** (will cause resolution to fail):
- ❌ `context` - Execution concern, not template concern
- ❌ `schemas` - Execution concern, not template concern  
- ❌ `developer_controls` - Execution concern, not template concern
- ❌ `inherits` - Use `extends` instead
- ❌ `parentRef` - Use `extends` instead

## Usage in Registry

Real templates in the registry use v1-conformant inheritance:

**Working:**
- `registry/prompt-templates/all-purpose/all-purpose.template.v1.yaml`
  - Root template with comprehensive placeholder set
  - Contains only content fields (`metadata`, `placeholders`, `template`)
- `registry/prompt-templates/fun/limerick.template.v1.yaml`
  - Uses canonical `extends: ../all-purpose/all-purpose.template.v1.yaml` syntax
  - Adds domain-specific placeholders
  - Overrides sections with explicit `override: true`

## Integration

The template resolver integrates with existing Vibeify tools:

```javascript
// 1. Resolve template
const { resolveTemplate } = require('./tools/template-resolver.js');
const resolved = resolveTemplate('path/to/template.yaml');

// 2. Derive input schema
const { derivePromptInputSchema } = require('./tools/generate-input-schema.js');
const schema = derivePromptInputSchema(resolved);

// 3. Validate prompt definition
const Ajv = require('ajv');
const ajv = new Ajv();
const validate = ajv.compile(schema);
const valid = validate(promptDefinition.input);
```

## Performance

Template resolution is designed for:
- **Build-time operation** (not runtime)
- **Caching-friendly** (deterministic output)
- **Fast failure** (errors caught immediately)

Typical resolution time: <10ms for templates with 2-3 levels of inheritance.

## Future Enhancements

Potential improvements (not required for v1):

- [ ] Resolution result caching
- [ ] Template inheritance visualization
- [ ] Circular dependency graph visualization
- [ ] Multi-file template composition
- [ ] Template inheritance linting rules

## Support

For questions or issues:

1. Check the [Usage Guide](./template-resolution-usage.md)
2. Review the [Examples](./template-resolution-example.md)
3. Run the conformance tests: `npm run test:templates`
4. Check error category in `TemplateResolutionError`

## License

See repository root for license information.
