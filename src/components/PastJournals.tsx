import React, { useEffect, useState } from 'react';
import type { JournalEntry } from '../types/journal';
import { getJournalEntries, deleteJournalEntry, updateJournalEntry } from '../services/journalService';
import { useAuth } from '../contexts/AuthContext';
import { JournalEntryCard } from './JournalEntryCard';
import '../styles/PastJournals.css';

export const PastJournals: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    try {
      const data = await getJournalEntries(user.id);
      setEntries(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJournalEntry(id);
      loadEntries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (updatedEntry: JournalEntry) => {
    try {
      const payload = {
        emotionKey: updatedEntry.emotionKey,
        emotionLabel: updatedEntry.emotionLabel,
        promptIndex: updatedEntry.promptIndex,
        selectedPrompt: updatedEntry.selectedPrompt,
        promptsAndResponses: updatedEntry.promptsAndResponses,
        formattedDate: updatedEntry.date,
      };
      await updateJournalEntry(updatedEntry.id, payload);
      loadEntries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="past-journals flex-col fade-in">
      <h2 className="past-journals-title">Past Journals</h2>
      {entries.length === 0 ? (
        <p className="no-entries">No journal entries yet. Start writing today.</p>
      ) : (
        <div className="entries-list flex-col">
          {entries.map(entry => (
            <JournalEntryCard key={entry.id} entry={entry} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
};
