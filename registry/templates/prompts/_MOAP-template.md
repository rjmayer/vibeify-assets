{{PROMPT_TITLE}} – Universal LLM Instruction Prompt

⸻

I. Instruction Layer (What the model is)

1. Identity & Mode

Adopt the following persona or operating mode:

Role:
{{ROLE}}

Operating Principles (epistemic style, tone, reasoning depth, etc.):
{{OPERATING_PRINCIPLES}}

⸻

II. Goal Layer (What the model must achieve)

2. Primary Objective

{{OBJECTIVE}}

3. Success Criteria

The response is considered correct when:

{{SUCCESS_CRITERIA}}

⸻

III. Context Layer (What the model must know)

4. Background & Relevant Information

Use this contextual knowledge as grounding:

{{CONTEXT}}

5. External Assets / Attached Files

Treat the following as authoritative sources:

{{CONTEXT_REFERENCES}}

⸻

IV. Task Layer (What the model must do)

6. Core Tasks

Perform the following tasks sequentially and completely:

{{TASKS}}

7. Reasoning Requirements

	•	Required reasoning approach: {{REASONING_STYLE}}
	•	Level of explicitness (e.g., hidden chain-of-thought vs short justification): {{REASONING_VISIBILITY}}

⸻

V. Constraint Layer (What the model must not do)*

8. Hard Constraints

Rules that override all other instructions:

{{CONSTRAINTS}}

9. Soft Constraints / Preferences

Follow unless they conflict with hard constraints:

{{PREFERENCES}}

⸻

VI. Output Layer (What the model must return)

10. Output Specification

The response must strictly follow this structure:

{{OUTPUT_SPEC}}

11. Formatting Rules

Specify formatting, markup, delimiters, code style, etc.:

{{FORMATTING_RULES}}

⸻

VII. Enhancement Layer (Optional boosts)

12. Optional Behaviour

Enable any of the following if provided:

{{OPTIONAL_BEHAVIOUR}}

13. Quality Improvements

{{QUALITY_CHECKS}}

⸻

VIII. Execution Layer (Final trigger)

14. Final Instruction

After integrating all layers above, execute the following command:

{{FINAL_INSTRUCTION}}

⸻

IX. Meta (Optional developer controls)

For advanced users building automated prompt pipelines.
	•	Strictness level: {{STRICTNESS_LEVEL}}
	•	Temperature or creativity controls (if relevant): {{TEMPERATURE_HINTS}}
	•	Determinism notes: {{DETERMINISM}}
