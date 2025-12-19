# Template Resolution Example

This example demonstrates a complete workflow for creating templates with inheritance and resolving them.

## Step 1: Create a Base Template

File: `registry/prompt-templates/base/simple-base.yaml`

```yaml
metadata:
  templateId: "simple-base"
  title: "Simple Base Template"
  version: "1.0.0"

placeholders:
  TASK:
    type: string
    required: true
    description: "The task to perform"

  CONSTRAINTS:
    type: array
    items: string
    required: false
    description: "Optional constraints"

template:
  instruction_section: |
    You are a helpful assistant.

  task_section: |
    Your task is: {{TASK}}
    
    {{#if CONSTRAINTS}}
    Follow these constraints:
    {{CONSTRAINTS}}
    {{/if}}
```

## Step 2: Create a Specialized Template

File: `registry/prompt-templates/specialized/code-task.yaml`

```yaml
extends: ../base/simple-base.yaml

metadata:
  templateId: "code-task"
  title: "Code Task Template"
  version: "1.0.0"

placeholders:
  # Strengthen CONSTRAINTS from optional to required
  CONSTRAINTS:
    type: array
    items: string
    required: true
    description: "Mandatory coding constraints"
  
  # Add new placeholder
  LANGUAGE:
    type: string
    required: true
    description: "Programming language to use"

template:
  # Override instruction section
  instruction_section:
    override: true
    text: |
      You are an expert software engineer.
  
  # Add new section
  language_section: |
    Use {{LANGUAGE}} for implementation.
```

## Step 3: Resolve the Template

```javascript
const { resolveTemplate } = require('./tools/template-resolver.js');
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

// Resolve the specialized template
const templatePath = path.join(
  __dirname, 
  'registry/prompt-templates/specialized/code-task.yaml'
);

const resolved = resolveTemplate(templatePath);

// The resolved template contains:
console.log('Resolved template has:');
console.log('- Placeholders:', Object.keys(resolved.placeholders));
// Output: ['TASK', 'CONSTRAINTS', 'LANGUAGE']

console.log('- Sections:', Object.keys(resolved.template));
// Output: ['instruction_section', 'task_section', 'language_section']

console.log('- No inheritance metadata:', {
  extends: resolved.extends === undefined,
  inherits: resolved.inherits === undefined,
  parentRef: resolved.parentRef === undefined
});
// Output: { extends: true, inherits: true, parentRef: true }

// Verify placeholder strengthening
console.log('CONSTRAINTS is required:', resolved.placeholders.CONSTRAINTS.required);
// Output: true

// Write resolved template to file (optional)
fs.writeFileSync(
  'code-task.resolved.yaml',
  yaml.dump(resolved)
);
```

## Step 4: What Gets Resolved

The resolved template will look like this:

```yaml
metadata:
  templateId: "code-task"
  title: "Code Task Template"
  version: "1.0.0"

placeholders:
  TASK:
    type: string
    required: true
    description: "The task to perform"
  
  CONSTRAINTS:
    type: array
    items: string
    required: true  # Strengthened from optional
    description: "Mandatory coding constraints"
  
  LANGUAGE:
    type: string
    required: true
    description: "Programming language to use"

template:
  instruction_section: |
    You are an expert software engineer.
  
  task_section: |
    Your task is: {{TASK}}
    
    {{#if CONSTRAINTS}}
    Follow these constraints:
    {{CONSTRAINTS}}
    {{/if}}
  
  language_section: |
    Use {{LANGUAGE}} for implementation.
```

Key observations:

1. ✅ `TASK` inherited from base
2. ✅ `CONSTRAINTS` strengthened from optional to required
3. ✅ `LANGUAGE` added by specialized template
4. ✅ `instruction_section` overridden by child
5. ✅ `task_section` inherited unchanged from base
6. ✅ `language_section` added by child
7. ✅ No `extends`, `inherits`, or `parentRef` fields remain

## Step 5: Derive Input Schema

After resolution, derive the input schema:

```javascript
const { derivePromptInputSchema } = require('./tools/generate-input-schema.js');
const fs = require('fs');
const yaml = require('js-yaml');

// Write resolved template to temp file
fs.writeFileSync('temp-resolved.yaml', yaml.dump(resolved));

// Derive schema from resolved template
const schema = derivePromptInputSchema('temp-resolved.yaml');

console.log(JSON.stringify(schema, null, 2));
```

Output schema:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Vibeify Prompt Input Schema (derived)",
  "description": "Auto-derived from prompt-template.yaml",
  "type": "object",
  "properties": {
    "TASK": {
      "type": "string",
      "description": "The task to perform"
    },
    "CONSTRAINTS": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Mandatory coding constraints"
    },
    "LANGUAGE": {
      "type": "string",
      "description": "Programming language to use"
    }
  },
  "required": ["TASK", "CONSTRAINTS", "LANGUAGE"],
  "additionalProperties": false
}
```

Notice:
- All three placeholders appear in the schema
- `CONSTRAINTS` is in the `required` array (strengthened)
- No distinction between inherited and native placeholders
- `additionalProperties: false` prevents undeclared inputs

## Step 6: Use in a Prompt Definition

Create a prompt definition using the resolved schema:

```yaml
# File: services/coding/create-api-endpoint.yaml
templateRef: registry/prompt-templates/specialized/code-task.yaml

input:
  TASK: "Create a REST API endpoint for user registration"
  CONSTRAINTS:
    - "Use Express.js framework"
    - "Validate email format"
    - "Hash passwords with bcrypt"
  LANGUAGE: "JavaScript"
```

This prompt definition:
- ✅ Is validated against the derived schema
- ✅ Has no knowledge of template inheritance
- ✅ Works identically whether template uses inheritance or not
- ✅ Can override inputs via CLI: `--set LANGUAGE="TypeScript"`

## Complete Resolution Flow

```
code-task.yaml (child)
  ↓ extends
simple-base.yaml (parent)
  ↓ resolve
Resolved Template (flattened)
  ↓ derive
Input Schema
  ↓ validate
Prompt Definition
  ↓ render
Final Prompt Text
```

Each stage is deterministic and produces the same result every time.

## Error Handling Example

What happens if you make a mistake?

### Example: Type Conflict

```yaml
extends: ../base/simple-base.yaml

placeholders:
  TASK:
    type: array  # ❌ Base defines TASK as string
    items: string
    required: true
```

Error:

```
TemplateResolutionError: Type conflict for placeholder 'TASK': parent has 'string', child has 'array'
Category: TYPE_CONFLICT
Template: specialized/code-task.yaml
```

### Example: Weakening Constraint

```yaml
extends: ../base/simple-base.yaml

placeholders:
  TASK:
    type: string
    required: false  # ❌ Base defines TASK as required
```

Error:

```
TemplateResolutionError: Cannot weaken constraint for placeholder 'TASK': parent is required, child is optional
Category: CONSTRAINT_WEAKENING
Template: specialized/code-task.yaml
```

### Example: Circular Inheritance

```yaml
# a.yaml
extends: b.yaml

# b.yaml  
extends: a.yaml
```

Error:

```
TemplateResolutionError: Circular inheritance detected: a.yaml
Category: CIRCULAR_INHERITANCE
Template: a.yaml
```

## Testing Your Templates

After creating templates, run the conformance tests:

```bash
npm run test:templates
```

Or create a specific test:

```javascript
const { resolveTemplate } = require('./tools/template-resolver.js');
const assert = require('assert');

// Test basic resolution
const resolved = resolveTemplate('path/to/template.yaml');
assert(resolved.placeholders.TASK, 'Should have TASK');
assert(resolved.template.task_section, 'Should have task_section');
assert(!resolved.extends, 'Should not have extends');

console.log('✅ Template resolved successfully');
```

## Summary

Template resolution in Vibeify:
1. Is **deterministic** - same input always produces same output
2. Is **transparent** - downstream systems can't tell if inheritance was used
3. Is **safe** - type conflicts and constraint weakening are caught early
4. Is **auditable** - clear error messages with categories
5. Is **complete** - all placeholders and sections are explicitly defined in resolved template

This makes it safe to build complex template hierarchies while maintaining schema fidelity and clear contracts.
