import React, { useState, useEffect } from 'react';
import '../styles/PromptCard.css';

interface PromptCardProps {
  prompt: string;
  onContinue: (response: string) => void;
  isLast?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onContinue, isLast = false }) => {
  const [response, setResponse] = useState('');

  // Reset response when prompt changes
  useEffect(() => {
    setResponse('');
  }, [prompt]);

  const handleContinue = () => {
    if (response.trim()) {
      onContinue(response.trim());
    }
  };

  return (
    <div className="prompt-card flex-col fade-in">
      <h2 className="prompt-text">{prompt}</h2>
      <textarea
        className="prompt-textarea"
        placeholder="Type your thoughts here..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        autoFocus
      />
      <button 
        className="continue-btn"
        onClick={handleContinue}
        disabled={!response.trim()}
      >
        {isLast ? 'Complete' : 'Continue'}
      </button>
    </div>
  );
};
