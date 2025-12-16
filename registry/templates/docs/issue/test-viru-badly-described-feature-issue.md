---
name: Test /vibe run-prompt wtf
about: An issue to smoketest the '/vibe run-prompt wtf' command
labels: vibe:run-prompt, testing 
---

### Command
/vibe run-prompt wtf

### Notes
This is a test.

It's a simulation of feature that hasn't been well written.

Normally, the dev would read it, think WTF and then ask the PO for clarification and be none the wiser.

Vibified, the job of the AI would be to take a best case guess at trying to figure out what needs to be done, and summarise that in an issue comment.

To make it do that, the dev would add the label "vibe:run-prompt" and edits the description (better, post a comment) with the command `/vibe run-prompt wtf`

Coding Assistant is listening for labels "vibe:run-prompt"

"wtf" would be resolved to prompt saved in `.vibeify/prompts/wtf.md` which would say sth like:

"Read the issue description, try to figure out what's meant in the context of the codebase add a comment to the issue and remove the label and maybe tag the dev."
