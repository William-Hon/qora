\---

name: qora-readme-session-update

description: Automatically updates README.md at the end of a coding session to reflect the current state of the Qora project, including implemented features, recent changes, current architecture, known limitations, and next steps.

\---



\# Qora README Session Update



\## Purpose



This skill should be run at the \*\*end of every meaningful coding session\*\*.



Its job is to keep `README.md` as the single source of truth for the current state of the Qora project.



The README should always accurately reflect what exists in the codebase today.



\---



\## Workflow



Before editing README.md:



1\. Inspect the current project.

2\. Read the existing README.md.

3\. Review files modified during this session.

4\. If Git is available, inspect:

&#x20;  - `git status`

&#x20;  - `git diff --stat`

&#x20;  - `git diff`

5\. Read any relevant documentation files if they exist.



Never assume a feature exists.



Only document features that are actually implemented.



\---



\## Update README.md



Update these sections.



\### Overview



Brief description of Qora.



Keep this updated as the product evolves.



\---



\### Current Product Stage



Examples:



\- Concept

\- Frontend MVP

\- Journaling MVP

\- Smart Prompt MVP

\- Emotion Detection MVP

\- Polishing

\- Production Ready



Choose the stage that best matches the current code.



\---



\### Current Features



Only list implemented features.



Example:



\- Guided journaling flow

\- Local journal storage

\- Emotion detection

\- Smart follow-up prompts

\- Past journal history



Never list planned features here.



\---



\### Latest Session Changes



Summarize exactly what changed during this coding session.



Use:



Added

\- ...



Changed

\- ...



Removed

\- ...



Fixed

\- ...



Only include categories that apply.



\---



\### Current Journal Flow



Document the actual implemented flow.



For example:



1\. User answers "What do you feel right now?"

2\. User answers "Why do you feel this?"

3\. Emotion detection runs.

4\. If confidence is low, fallback emotion picker appears.

5\. Appropriate reflection prompt is shown.

6\. Journal entry is saved.



Only describe what actually exists.



\---



\### Tech Stack



Update if necessary.



Example:



\- Vite

\- React

\- TypeScript

\- CSS

\- Local Storage



\---



\### Folder Overview



Only include important folders.



Example:



src/

components/

lib/

hooks/

pages/



\---



\### Known Limitations



Be honest.



Examples:



\- Local storage only

\- No backend

\- No authentication

\- No cloud sync

\- Emotion detection uses deterministic keyword matching



Only include real limitations.



\---



\### Next Steps



Generate the next logical development tasks based on the current implementation.



Limit to around 5 items.



Prioritize unfinished work.



\---



\### Running Locally



Keep installation instructions accurate.



\---



\## Documentation Rules



Do NOT:



\- Invent features

\- Exaggerate progress

\- Delete useful setup instructions

\- Rewrite the README into marketing copy

\- Remove sections unless they are obsolete



Do:



\- Keep README concise.

\- Keep it technically accurate.

\- Update outdated sections.

\- Remove stale information.

\- Preserve formatting consistency.



\---



\## Final Response



After updating README.md, provide a short summary:



\- README updated successfully

\- Files inspected

\- Major changes documented

\- Any uncertainty about project state

