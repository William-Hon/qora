import type { Mood } from '../types/journal';

export const moodPrompts: Record<Mood, string> = {
  motivated: "Where should I put this energy today?",
  stressed: "What part of this is actually in your control?",
  tired: "What is draining you the most?",
  sad: "What do you need right now?",
  lost: "What feels unclear right now?",
  anxious: "What are you worried might happen?",
  angry: "What expectation or boundary felt crossed?",
  happy: "What made today feel good?",
  calm: "What helped you feel steady?",
  indifferent: "Are you calm, numb, or checked out?",
  default: "What feels most important to understand right now?"
};

export const fixedPrompts = [
  "What do you feel?",
  "Why do you feel this?",
  "What's next?"
];
