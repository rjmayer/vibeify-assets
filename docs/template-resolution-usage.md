# Template Resolution Usage Guide

This document explains how to use the Vibeify template resolution system for creating and using templates with inheritance.

## Overview

The template resolution system allows you to create specialized templates that inherit from base templates, promoting code reuse while maintaining clear content structure boundaries.

## Basic Usage

### Resolving a Template

```javascript
const { resolveTemplate } = require('./tools/template-resolver.js');

// Resolve a template (with or without inheritance)
const resolved = resolveTemplate('path/to/template.yaml');

// The resolved template has no inheritance metadata
// and can be used directly for schema derivation or rendering
```

### Error Handling

```javascript
const { resolveTemplate, TemplateResolutionError } = require('./tools/template-resolver.js');

try {
  const resolved = resolveTemplate('path/to/template.yaml');
  // Use the resolved template
} catch (error) {
  if (error instanceof TemplateResolutionError) {
    console.error(`Resolution failed: ${error.message}`);
    console.error(`Category: ${error.category}`);
    console.error(`Template: ${error.templateRef}`);
  } else {
    throw error;
  }
}
```

## Creating Templates with Inheritance

### Option 1: Simple extends syntax

```yaml
extends: ../parent/parent-template.yaml

metadata:
  templateId: "my-specialized-template"
  title: "My Template"
  version: "1.0.0"

placeholders:
  # Add new placeholders or strengthen inherited ones
  NEW_FIELD:
    type: string
    required: true
    description: "A new field"

template:
  new_section: |
    Content for new section
```

### Option 2: Nested extends with templateRef

```yaml
extends:
  templateRef: ../parent/parent-template.yaml

# Rest of template definition...
```

### Option 3: Using inherits

```yaml
inherits:
  templateRef: ../parent/parent-template.yaml

# Rest of template definition...
```

## Placeholder Rules

### Inheriting Placeholders

Child templates automatically inherit all placeholders from their parent:

```yaml
# Parent defines OBJECTIVE
extends: parent.yaml

# Child can use OBJECTIVE without redeclaring it
template:
  goal_section: |
    Your objective is: {{OBJECTIVE}}
```

### Strengthening Constraints

You can make optional placeholders required (but not vice versa):

```yaml
# Parent has:
# CONSTRAINTS:
#   type: array
#   required: false

extends: parent.yaml

placeholders:
  CONSTRAINTS:
    type: array        # Must keep same type
    items: string      # Must keep same items type
    required: true     # Can strengthen from optional to required
    description: "Now mandatory"
```

### Adding New Placeholders

```yaml
extends: parent.yaml

placeholders:
  MY_NEW_FIELD:
    type: string
    required: false
    description: "A new optional field"
```

## Section Rules

### Inheriting Sections

Sections not mentioned in the child are inherited unchanged:

```yaml
# Parent defines intro_section and goal_section

extends: parent.yaml

# goal_section is inherited automatically
template:
  constraints_section: |
    New section added by child
```

### Explicit Section Override

Use `override: true` to replace a parent section:

```yaml
extends: parent.yaml

template:
  intro_section:
    override: true
    text: |
      This replaces the parent's intro_section
```

### Explicit Section Removal

Use `remove: true` to remove an inherited section:

```yaml
extends: parent.yaml

template:
  unwanted_section:
    remove: true
```

## Error Categories

The template resolver provides specific error categories for different failure modes:

| Category | Meaning |
|----------|---------|
| `TEMPLATE_NOT_FOUND` | The template file doesn't exist |
| `CIRCULAR_INHERITANCE` | A → B → A circular dependency detected |
| `MULTIPLE_PARENTS` | Template declares more than one parent |
| `TYPE_CONFLICT` | Child changes placeholder type incompatibly |
| `CONSTRAINT_WEAKENING` | Child makes required placeholder optional |
| `FORBIDDEN_FIELD` | Template contains execution/governance metadata |
| `MISSING_TYPE` | Placeholder declaration missing required type field |
| `INVALID_TEMPLATE` | Template structure is malformed |

## Best Practices

### 1. Keep the Type System Consistent

Always include the type when redeclaring a placeholder:

```yaml
# ✅ Good
placeholders:
  FIELD:
    type: string
    required: true

# ❌ Bad - will fail validation
placeholders:
  FIELD:
    required: true  # Missing type!
```

### 2. Use Relative Paths for Parents

Reference parent templates using relative paths from the child template:

```yaml
# In registry/prompt-templates/specialized/child.yaml
extends: ../base/parent.yaml
```

### 3. Be Explicit with Overrides

Use `override: true` when replacing sections to make intent clear:

```yaml
template:
  intro_section:
    override: true  # Clearly indicates this replaces parent
    text: |
      New intro text
```

### 4. Don't Include Execution Metadata

Templates should only contain content structure. Never include:

- `promptId`, `promptClass`, `lifecycle`
- `execution`, `model`, `temperature`
- Any governance or runtime configuration

These belong in prompt definitions or execution envelopes.

### 5. Test Your Templates

After creating a template with inheritance, resolve it to ensure it works:

```bash
npm run test:templates
```

Or test a specific template:

```javascript
const { resolveTemplate } = require('./tools/template-resolver.js');
const resolved = resolveTemplate('path/to/your/template.yaml');
console.log('Placeholders:', Object.keys(resolved.placeholders));
console.log('Sections:', Object.keys(resolved.template));
```

## Real-World Example

See `registry/prompt-templates/product/mvp-proposal.template.v1.yaml` for a complete example of a specialized template that inherits from `all-purpose.template.v1.yaml`.

The resolution process:

1. Loads `mvp-proposal.template.v1.yaml`
2. Follows `inherits.templateRef` to `all-purpose.template.v1.yaml`
3. Merges child onto parent (base-first, child-last)
4. Produces a flattened template with all placeholders and sections
5. Removes all inheritance metadata

The result is a standalone template that can be used for schema derivation and rendering without any knowledge of the inheritance chain.

## Testing

The template resolution implementation includes a comprehensive conformance test suite:

```bash
# Run all template resolution tests
npm run test:templates
```

The test suite covers:
- Basic resolution (single template, two-level inheritance)
- Determinism (same input = same output)
- Inheritance graph validation (circular, multiple parents)
- Placeholder rules (inheritance, redeclaration, type conflicts)
- Section rules (inheritance, override, removal)
- Schema derivability (single schema, no hidden inputs)
- Boundary enforcement (no forbidden fields)
- Flattening guarantees (no inheritance artifacts)
- Failure semantics (fail fast, error specificity)

All 25 required conformance tests pass successfully.
