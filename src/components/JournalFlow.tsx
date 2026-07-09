import React, { useState } from 'react';
import { PromptCard } from './PromptCard';
import { ProgressIndicator } from './ProgressIndicator';
import { EmotionFallbackSurvey } from './EmotionFallbackSurvey';
import { detectStrongestEmotion } from '../lib/emotions/detectEmotion';
import type { DetectionResult } from '../lib/emotions/detectEmotion';
import type { EmotionKey } from '../lib/emotions/emotionTypes';
import { EMOTION_BANK } from '../lib/emotions/emotionPromptBank';
import { createJournalEntry } from '../services/journalService';
import { useAuth } from '../contexts/AuthContext';
import type { PromptResponse } from '../types/journal';
import '../styles/JournalFlow.css';

export const JournalFlow: React.FC<{ onComplete: () => void, onViewPast: () => void }> = ({ onComplete, onViewPast }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0); 
  const [responses, setResponses] = useState<PromptResponse[]>([]);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const totalSteps = 3;

  const handleContinue = (response: string, source: string = 'typed') => {
    let currentPromptStr = "";
    if (step === 0) currentPromptStr = "What do you feel right now?";
    else if (step === 1) currentPromptStr = "Why do you feel this?";
    else if (step === 2 && detectionResult?.selectedPrompt) {
      currentPromptStr = detectionResult.selectedPrompt;
    }

    const updatedResponses = [...responses];
    updatedResponses[step] = { prompt: currentPromptStr, response };
    // Slice off any subsequent steps if the user went back and edited
    const finalResponses = updatedResponses.slice(0, step + 1);
    setResponses(finalResponses);

    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      const res = detectStrongestEmotion({
        promptOneAnswer: finalResponses[0].response,
        promptTwoAnswer: finalResponses[1].response
      });
      setDetectionResult(res);
      
      if (res.needsFallback) {
        setShowFallback(true);
      } else {
        setStep(2);
      }
    } else if (step === 2) {
      if (!user) return;
      
      const entry = {
        date: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        emotionKey: detectionResult?.emotionKey || null,
        emotionLabel: detectionResult?.emotionLabel || null,
        selectedPrompt: detectionResult?.selectedPrompt || null,
        promptIndex: detectionResult?.promptIndex || null,
        promptsAndResponses: finalResponses,
      };
      
      const entryDate = new Date().toISOString().split('T')[0];
      
      createJournalEntry(user.id, entryDate, entry, source).then(() => {
        setIsFinished(true);
      }).catch(err => {
        console.error('Failed to save entry', err);
      });
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
        onBack={step > 0 ? () => setStep(step - 1) : undefined}
        initialResponse={responses[step]?.response || ''}
        isLast={step === totalSteps - 1} 
      />
    </div>
  );
};
