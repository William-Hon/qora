/**
 * MIGRATION NOTE:
 * LocalStorage journal storage has been migrated to Supabase.
 * Please use src/services/journalService.ts for all journal interactions.
 * 
 * If you need to recover old localStorage entries, you can read from the 'qora_journal_entries' key.
 */

export function getLegacyLocalEntries(): any[] {
  const data = localStorage.getItem('qora_journal_entries');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
