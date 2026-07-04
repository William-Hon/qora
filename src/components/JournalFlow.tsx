import React, { useState } from 'react';
import { PromptCard } from './PromptCard';
import { ProgressIndicator } from './ProgressIndicator';
import { fixedPrompts, moodPrompts } from '../data/moodPrompts';
import { detectMood } from '../utils/mood';
import { saveJournalEntry } from '../utils/storage';
import type { PromptResponse, Mood } from '../types/journal';
import '../styles/JournalFlow.css';

export const JournalFlow: React.FC<{ onComplete: () => void, onViewPast: () => void }> = ({ onComplete, onViewPast }) => {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<PromptResponse[]>([]);
  const [detectedMood, setDetectedMood] = useState<Mood>('default');
  const [isFinished, setIsFinished] = useState(false);

  const totalSteps = 4;

  const getCurrentPrompt = () => {
    if (step === 0) return fixedPrompts[0];
    if (step === 1) return fixedPrompts[1];
    if (step === 2) return moodPrompts[detectedMood] || moodPrompts.default;
    return fixedPrompts[2];
  };

  const handleContinue = (response: string) => {
    const currentPrompt = getCurrentPrompt();
    const newResponses = [...responses, { prompt: currentPrompt, response }];
    setResponses(newResponses);

    if (step === 0) {
      // Detect mood after first answer
      setDetectedMood(detectMood(response));
    }

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Save entry
      const entry = {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        createdAt: Date.now(),
        detectedMood: step === 0 ? detectMood(response) : detectedMood,
        promptsAndResponses: newResponses,
      };
      saveJournalEntry(entry);
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="completion-state flex-col items-center justify-center fade-in">
        <h2>Saved for today</h2>
        <p>Your thoughts have been safely stored.</p>
        <div className="completion-actions flex-col">
          <button className="primary-btn" onClick={onComplete}>New Entry</button>
          <button className="secondary-btn" onClick={onViewPast}>View Past Journals</button>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-flow flex-col">
      <ProgressIndicator totalSteps={totalSteps} currentStep={step} />
      <PromptCard 
        prompt={getCurrentPrompt()} 
        onContinue={handleContinue} 
        isLast={step === totalSteps - 1} 
      />
    </div>
  );
};
