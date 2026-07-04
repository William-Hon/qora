import type { JournalEntry } from '../types/journal';

const STORAGE_KEY = 'qora_journal_entries';

export function saveJournalEntry(entry: JournalEntry): void {
  const entries = getJournalEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getJournalEntries(): JournalEntry[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as JournalEntry[];
  } catch {
    return [];
  }
}

export function deleteJournalEntry(id: string): void {
  const entries = getJournalEntries();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
}
