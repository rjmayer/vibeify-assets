# {{PROMPT_TITLE}}

---

>## Instruction Layer (What the model is)
>
>### Model Profile
>
Adopt the following persona and operating mode:

**Role:**  

You are {{ROLE}}

**Operating Principles:** 
> _epistemic style, tone, reasoning depth, etc._

{{OPERATING_PRINCIPLES}}

**Reasoning Style:** 

{{REASONING_STYLE}}

**Reasoning Visability:** 
> _e.g. hidden chain-of-thought vs short justification, etc._

{{REASONING_VISIBILITY}}

>---
>
>## Goal Layer (What the model must achieve)
>
>### Primary Objective

**Primary Objective:**  

Your goal is to {{OBJECTIVE}}
>
>### Success Criteria

**Success Criteria:**  Your goal is achieved when:

{{SUCCESS_CRITERIA}}

>---
>
>## Context Layer (What the model must know)
>
>### Background & Relevant Information
>
**Context:** Use this contextual knowledge as grounding:

{{CONTEXT}}

>### External Assets / Attached Files
>
**Context References:** Treat the following as authoritative sources:

{{CONTEXT_REFERENCES}}

>---
>
>## Task Layer (What the model must do)
>
>### Core Tasks
>
**Tasks:** Perform the following tasks sequentially and completely:

{{TASKS}}

>---
>
>## Constraint Layer (What the model must not do)\*
>
>### Hard Constraints
>
Rules that override all other instructions:

{{CONSTRAINTS}}

>### Soft Constraints / Preferences
>
Follow unless they conflict with hard constraints:

{{PREFERENCES}}

>---
>
>## VI. Output Layer (What the model must return)
>
>### Output Specification
>
The response must strictly follow this structure:

{{OUTPUT_SPEC}}

>### Formatting Rules
>
Specify formatting, markup, delimiters, code style, etc.:

{{FORMATTING_RULES}}

>---
>
>## Enhancement Layer (Optional boosts)
>
>### Optional Behaviour
>
Enable any of the following if provided:

{{OPTIONAL_BEHAVIOUR}}

### Quality Improvements

{{QUALITY_CHECKS}}

>---
>
>## Execution Layer (Final trigger)
>
>### Final Instruction
>
After integrating all layers above, execute the following command:

{{FINAL_INSTRUCTION}}

>---
>
>## Meta (Optional developer controls)
>
>For advanced users building automated prompt pipelines.

- Strictness level: {{STRICTNESS_LEVEL}}
- Temperature or creativity controls (if relevant): {{TEMPERATURE_HINTS}}
- Determinism notes: {{DETERMINISM}}
