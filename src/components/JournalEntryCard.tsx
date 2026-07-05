import React, { useState } from 'react';
import type { JournalEntry } from '../types/journal';
import '../styles/JournalEntryCard.css';

interface Props {
  entry: JournalEntry;
  onDelete: (id: string) => void;
  onUpdate: (entry: JournalEntry) => void;
}

export const JournalEntryCard: React.FC<Props> = ({ entry, onDelete, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const firstResponse = entry.promptsAndResponses[0]?.response || '';
  const previewText = firstResponse.length > 80 ? firstResponse.slice(0, 80) + '...' : firstResponse || 'No content';

  const handleEditClick = (e: React.MouseEvent, idx: number, currentResponse: string) => {
    e.stopPropagation();
    setEditingIndex(idx);
    setEditValue(currentResponse);
  };

  const handleSave = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    if (!editValue.trim()) return;
    
    const newEntry = { ...entry };
    newEntry.promptsAndResponses = [...entry.promptsAndResponses];
    newEntry.promptsAndResponses[idx] = { ...newEntry.promptsAndResponses[idx], response: editValue.trim() };
    
    onUpdate(newEntry);
    setEditingIndex(null);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(null);
  };

  return (
    <div className="entry-card" onClick={() => { if (editingIndex === null) setExpanded(!expanded); }}>
      <div className="entry-header flex-row justify-between items-center">
        <div>
          <span className="entry-date">{entry.date}</span>
          {entry.emotionLabel && <span className="entry-mood tag">{entry.emotionLabel}</span>}
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
              <div className="entry-qa-header flex-row justify-between items-center">
                <h4 className="entry-prompt">{item.prompt}</h4>
                {editingIndex !== idx && (
                  <button 
                    className="edit-btn"
                    onClick={(e) => handleEditClick(e, idx, item.response)}
                    aria-label="Edit response"
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </button>
                )}
              </div>
              
              {editingIndex === idx ? (
                <div className="edit-container" onClick={e => e.stopPropagation()}>
                  <textarea 
                    className="edit-textarea"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button className="save-btn" onClick={(e) => handleSave(e, idx)}>Save</button>
                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="entry-response">{item.response}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
