import type { EmotionKey } from '../lib/emotions/emotionTypes';

export interface PromptResponse {
  prompt: string;
  response: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  createdAt: number;
  emotionKey: EmotionKey | null;
  emotionLabel: string | null;
  promptIndex: number | null;
  selectedPrompt: string | null;
  promptsAndResponses: PromptResponse[];
}
