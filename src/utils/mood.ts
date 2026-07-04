import type { Mood } from '../types/journal';

export function detectMood(text: string): Mood {
  const normalizedText = text.toLowerCase();
  
  if (/\b(motivated|driven|locked in|focused)\b/.test(normalizedText)) return 'motivated';
  if (/\b(stressed|overwhelmed)\b/.test(normalizedText)) return 'stressed';
  if (/\b(tired|exhausted)\b/.test(normalizedText)) return 'tired';
  if (/\b(sad|down)\b/.test(normalizedText)) return 'sad';
  if (/\b(lost|confused)\b/.test(normalizedText)) return 'lost';
  if (/\b(anxious|worried)\b/.test(normalizedText)) return 'anxious';
  if (/\b(angry|frustrated|mad)\b/.test(normalizedText)) return 'angry';
  if (/\b(happy|good|great|joy|excited)\b/.test(normalizedText)) return 'happy';
  if (/\b(calm|peaceful|relaxed)\b/.test(normalizedText)) return 'calm';
  if (/\b(indifferent|numb|bored)\b/.test(normalizedText)) return 'indifferent';

  return 'default';
}
