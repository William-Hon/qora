import React, { useState, useEffect } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import '../styles/PromptCard.css';

interface PromptCardProps {
  prompt: string;
  onContinue: (response: string) => void;
  onBack?: () => void;
  initialResponse?: string;
  isLast?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onContinue, onBack, initialResponse = '', isLast = false }) => {
  const [response, setResponse] = useState(initialResponse);

  const handleSpeechResult = (text: string) => {
    setResponse(prev => {
      const current = prev.trim();
      return current ? `${current} ${text}` : text;
    });
  };

  const {
    isListening,
    isSupported,
    interimTranscript,
    toggleListening
  } = useSpeechToText(handleSpeechResult);

  // Reset response when prompt or initialResponse changes
  useEffect(() => {
    setResponse(initialResponse);
  }, [prompt, initialResponse]);

  const handleContinue = () => {
    if (response.trim()) {
      onContinue(response.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (response.trim()) {
        handleContinue();
      }
    }
  };

  return (
    <div className="prompt-card flex-col fade-in">
      <h2 className="prompt-text">{prompt}</h2>
      
      <div className="textarea-container flex-col">
        <textarea
          className="prompt-textarea"
          placeholder="Type your thoughts here..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        {isListening && interimTranscript && (
          <p className="interim-text">{interimTranscript}</p>
        )}
        
        <div className="input-actions row">
          {isSupported ? (
            <button 
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              title="Dictate with voice"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
              <span className="mic-btn-text">{isListening ? 'Listening...' : 'Dictate'}</span>
            </button>
          ) : (
            <p className="unsupported-msg">Voice input is not supported in this browser.</p>
          )}

          <div className="button-group">
            {onBack && (
              <button 
                className="back-btn"
                onClick={onBack}
              >
                Back
              </button>
            )}
            <button 
              className="continue-btn"
              onClick={handleContinue}
              disabled={!response.trim()}
            >
              {isLast ? 'Complete' : 'Continue'}
              <span className="shortcut-hint"> (Ctrl + Enter)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
