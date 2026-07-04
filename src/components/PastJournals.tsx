import React, { useEffect, useState } from 'react';
import type { JournalEntry } from '../types/journal';
import { getJournalEntries, deleteJournalEntry } from '../utils/storage';
import { JournalEntryCard } from './JournalEntryCard';
import '../styles/PastJournals.css';

export const PastJournals: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const data = getJournalEntries();
    // Sort descending by createdAt
    setEntries(data.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleDelete = (id: string) => {
    deleteJournalEntry(id);
    loadEntries();
  };

  return (
    <div className="past-journals flex-col fade-in">
      <h2 className="past-journals-title">Past Journals</h2>
      {entries.length === 0 ? (
        <p className="no-entries">No journal entries yet. Start writing today.</p>
      ) : (
        <div className="entries-list flex-col">
          {entries.map(entry => (
            <JournalEntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};
