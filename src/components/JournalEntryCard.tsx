import React, { useState } from 'react';
import type { JournalEntry } from '../types/journal';
import '../styles/JournalEntryCard.css';

interface Props {
  entry: JournalEntry;
  onDelete: (id: string) => void;
}

export const JournalEntryCard: React.FC<Props> = ({ entry, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const firstResponse = entry.promptsAndResponses[0]?.response || '';
  const previewText = firstResponse.length > 80 ? firstResponse.slice(0, 80) + '...' : firstResponse || 'No content';

  return (
    <div className="entry-card" onClick={() => setExpanded(!expanded)}>
      <div className="entry-header flex-row justify-between items-center">
        <div>
          <span className="entry-date">{entry.date}</span>
          <span className="entry-mood tag">{entry.detectedMood}</span>
        </div>
        <button 
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.id);
          }}
          aria-label="Delete entry"
        >
          ×
        </button>
      </div>
      
      {!expanded ? (
        <p className="entry-preview">{previewText}</p>
      ) : (
        <div className="entry-full fade-in">
          {entry.promptsAndResponses.map((item, idx) => (
            <div key={idx} className="entry-qa">
              <h4 className="entry-prompt">{item.prompt}</h4>
              <p className="entry-response">{item.response}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
