import React, { useState } from 'react';
import { PromptCard } from './PromptCard';
import { ProgressIndicator } from './ProgressIndicator';
import { EmotionFallbackSurvey } from './EmotionFallbackSurvey';
import { detectStrongestEmotion } from '../lib/emotions/detectEmotion';
import type { DetectionResult } from '../lib/emotions/detectEmotion';
import type { EmotionKey } from '../lib/emotions/emotionTypes';
import { EMOTION_BANK } from '../lib/emotions/emotionPromptBank';
import { saveJournalEntry } from '../utils/storage';
import type { PromptResponse } from '../types/journal';
import '../styles/JournalFlow.css';

export const JournalFlow: React.FC<{ onComplete: () => void, onViewPast: () => void }> = ({ onComplete, onViewPast }) => {
  const [step, setStep] = useState(0); 
  const [responses, setResponses] = useState<PromptResponse[]>([]);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const totalSteps = 3;

  const handleContinue = (response: string) => {
    let currentPromptStr = "";
    if (step === 0) currentPromptStr = "What do you feel right now?";
    else if (step === 1) currentPromptStr = "Why do you feel this?";
    else if (step === 2 && detectionResult?.selectedPrompt) {
      currentPromptStr = detectionResult.selectedPrompt;
    }

    const newResponses = [...responses, { prompt: currentPromptStr, response }];
    setResponses(newResponses);

    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      const res = detectStrongestEmotion({
        promptOneAnswer: newResponses[0].response,
        promptTwoAnswer: newResponses[1].response
      });
      setDetectionResult(res);
      
      if (res.needsFallback) {
        setShowFallback(true);
      } else {
        setStep(2);
      }
    } else if (step === 2) {
      const entry = {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        createdAt: Date.now(),
        emotionKey: detectionResult?.emotionKey || null,
        emotionLabel: detectionResult?.emotionLabel || null,
        selectedPrompt: detectionResult?.selectedPrompt || null,
        promptIndex: detectionResult?.promptIndex || null,
        promptsAndResponses: newResponses,
      };
      saveJournalEntry(entry);
      setIsFinished(true);
    }
  };

  const handleFallbackSelect = (emotionKey: EmotionKey, promptIndex: number, selectedPrompt: string) => {
    setDetectionResult(prev => ({
      ...prev!,
      emotionKey,
      emotionLabel: EMOTION_BANK[emotionKey].label,
      promptIndex,
      selectedPrompt,
      needsFallback: false
    }));
    setShowFallback(false);
    setStep(2);
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

  if (showFallback) {
    return (
      <div className="journal-flow flex-col">
        <ProgressIndicator totalSteps={totalSteps} currentStep={2} />
        <EmotionFallbackSurvey onSelect={handleFallbackSelect} />
      </div>
    );
  }

  const getCurrentPrompt = () => {
    if (step === 0) return "What do you feel right now?";
    if (step === 1) return "Why do you feel this?";
    if (step === 2 && detectionResult?.selectedPrompt) return detectionResult.selectedPrompt;
    return "...";
  };

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
