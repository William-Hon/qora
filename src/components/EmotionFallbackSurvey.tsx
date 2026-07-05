import React, { useState, useMemo } from 'react';
import type { EmotionKey } from '../lib/emotions/emotionTypes';
import { EMOTION_BANK } from '../lib/emotions/emotionPromptBank';
import '../styles/EmotionFallbackSurvey.css';

interface Props {
  onSelect: (emotionKey: EmotionKey, promptIndex: number, selectedPrompt: string) => void;
}

export const EmotionFallbackSurvey: React.FC<Props> = ({ onSelect }) => {
  const [search, setSearch] = useState('');

  const filteredEmotions = useMemo(() => {
    const query = search.toLowerCase().trim();
    const allEmotions = Object.values(EMOTION_BANK);
    if (!query) return allEmotions;

    return allEmotions.filter(e => {
      if (e.label.toLowerCase().includes(query)) return true;
      if (e.keywords.some(kw => kw.toLowerCase().includes(query))) return true;
      if (e.phrases.some(p => p.toLowerCase().includes(query))) return true;
      return false;
    });
  }, [search]);

  const handleSelect = (emotionKey: EmotionKey) => {
    const config = EMOTION_BANK[emotionKey];
    // Deterministic random selection for manual fallback choice
    const promptIndex = Math.floor(Math.random() * 3); 
    onSelect(emotionKey, promptIndex, config.promptOptions[promptIndex]);
  };

  return (
    <div className="fallback-survey flex-col fade-in">
      <div className="fallback-header">
        <h2>What feels closest?</h2>
        <p>I could not confidently read the strongest emotion from your entry. Choose the one that fits best.</p>
      </div>

      <input
        type="text"
        className="emotion-search"
        placeholder="Search emotions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="emotion-chips-container">
        {filteredEmotions.map(e => (
          <button
            key={e.key}
            className="emotion-chip"
            onClick={() => handleSelect(e.key)}
          >
            {e.label}
          </button>
        ))}
        {filteredEmotions.length === 0 && (
          <p className="no-emotions-found">No matching emotions found.</p>
        )}
      </div>
    </div>
  );
};
