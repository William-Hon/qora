export type Mood =
  | 'motivated'
  | 'stressed'
  | 'tired'
  | 'sad'
  | 'lost'
  | 'anxious'
  | 'angry'
  | 'happy'
  | 'calm'
  | 'indifferent'
  | 'default';

export interface PromptResponse {
  prompt: string;
  response: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  createdAt: number;
  detectedMood: Mood;
  promptsAndResponses: PromptResponse[];
}
