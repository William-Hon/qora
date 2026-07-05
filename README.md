# Qora

## Overview
Qora is a guided journaling application designed to help users process their feelings. It provides a structured flow where users write about their current feelings, why they feel that way, and then receive an intelligent follow-up prompt based on the emotions detected in their responses.

---

## Current Product Stage
Smart Prompt & Emotion Detection MVP

---

## Current Features
- Guided journaling flow with 3 steps
- Local journal storage (offline-first)
- Keyword-based emotion detection with confidence scoring and contextual modifiers (negation, intensifiers)
- Fallback emotion survey for low-confidence detections
- Smart follow-up prompts tailored to detected emotions
- Safety checks for high-risk keywords
- Speech-to-text dictation using the Web Speech API
- Keyboard shortcuts (Ctrl+Enter to submit) and ability to go back and edit previous answers
- Inline editing of past journal entries from the Past Journals page

---

## Latest Session Changes

Added
- Speech-to-text dictation using the Web Speech API (`useSpeechToText.ts` hook)

Changed
- `PromptCard`: Added a live-transcribing microphone button, a "Back" navigation button, and a `Ctrl+Enter` submit shortcut
- `JournalFlow`: Added backwards navigation and ability to edit previous steps dynamically
- `PastJournals` & `JournalEntryCard`: Added inline editing UI to modify previously saved journal answers
- `utils/storage`: Added `updateJournalEntry` to persist modifications

Removed
- (None this session)

---

## Current Journal Flow

1. User answers "What do you feel right now?"
2. User answers "Why do you feel this?"
3. Emotion detection engine evaluates responses.
4. If confidence is low or ambiguous, a fallback emotion picker appears.
5. An appropriate emotion-specific reflection prompt is shown.
6. Journal entry is saved to local storage.
7. Users can revisit the "Past Journals" tab to inline-edit their past answers.

---

## Tech Stack
- Vite
- React
- TypeScript
- CSS
- Local Storage

---

## Folder Overview

`src/`
`src/components/` - React components for the journaling flow
`src/hooks/` - Custom React hooks like `useSpeechToText`
`src/lib/emotions/` - Emotion detection logic, keywords, and prompts
`src/styles/` - Vanilla CSS styles
`src/types/` - TypeScript definitions
`src/utils/` - Local storage utilities

---

## Known Limitations
- Local storage only
- No backend
- No authentication
- No cloud sync
- Emotion detection uses deterministic keyword matching, which may miss complex emotional nuances compared to an AI model.

---

## Next Steps
- Add basic mood tracking analytics or charts.
- Improve emotion detection accuracy and context awareness.
- Add ability to re-run emotion detection if an entry is edited retroactively.
- Further polish the UI/UX.

---

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
