import { supabase } from '../lib/supabaseClient';
import type { JournalEntry } from '../types/journal';

/**
 * Creates a new journal entry in Supabase.
 */
export async function createJournalEntry(
  userId: string, 
  entryDate: string, 
  data: Partial<JournalEntry>, 
  source: string = 'typed'
): Promise<JournalEntry> {
  const responsesPayload = {
    emotionKey: data.emotionKey,
    emotionLabel: data.emotionLabel,
    promptIndex: data.promptIndex,
    selectedPrompt: data.selectedPrompt,
    promptsAndResponses: data.promptsAndResponses || [],
    formattedDate: data.date // Preserve the exact string from the UI
  };

  const { data: insertedData, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      entry_date: entryDate,
      responses: responsesPayload,
      source: source
    })
    .select()
    .single();

  if (error) throw error;
  
  return mapRowToJournalEntry(insertedData);
}

/**
 * Gets all journal entries for a user.
 */
export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(mapRowToJournalEntry);
}

/**
 * Gets a specific journal entry by date for a user.
 */
export async function getJournalEntryByDate(userId: string, entryDate: string): Promise<JournalEntry | null> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('entry_date', entryDate)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToJournalEntry(data) : null;
}

/**
 * Updates an existing journal entry.
 */
export async function updateJournalEntry(entryId: string, responsesPayload: any): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({
      responses: responsesPayload,
      updated_at: new Date().toISOString()
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) throw error;
  return mapRowToJournalEntry(data);
}

/**
 * Deletes a journal entry.
 */
export async function deleteJournalEntry(entryId: string): Promise<void> {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId);

  if (error) throw error;
}

/**
 * Helper to map a Supabase row to the frontend JournalEntry interface.
 */
function mapRowToJournalEntry(row: any): JournalEntry {
  return {
    id: row.id,
    date: row.responses?.formattedDate || row.entry_date, // Fallback to raw DB date if not present
    createdAt: new Date(row.created_at).getTime(),
    emotionKey: row.responses?.emotionKey || null,
    emotionLabel: row.responses?.emotionLabel || null,
    promptIndex: row.responses?.promptIndex ?? null,
    selectedPrompt: row.responses?.selectedPrompt || null,
    promptsAndResponses: row.responses?.promptsAndResponses || []
  };
}
