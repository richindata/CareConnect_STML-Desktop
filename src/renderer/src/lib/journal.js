// Shared Memory Journal store — a log both the patient and caregiver write to.
// Front-end-only demo data (same caveat as tasks.js / meds.js / reminders.js).
const JOURNAL_KEY = 'careconnect.journal';

// Mood options offered in the New Entry form (and shown as pills in the feed).
export const MOODS = [
  { key: 'Happy', emoji: '😊' },
  { key: 'Calm', emoji: '😌' },
  { key: 'Confused', emoji: '😕' },
  { key: 'Concerned', emoji: '😟' },
  { key: 'Tired', emoji: '🥱' },
];

export function moodEmoji(mood) {
  return MOODS.find((m) => m.key === mood)?.emoji || '';
}

const DEFAULT_ENTRIES = [
  {
    id: 'j1',
    author: 'Linda Chen',
    role: 'Caregiver',
    initial: 'L',
    mood: 'Calm',
    text: 'Margaret had a settled morning. Took her medications on time and enjoyed tea by the window.',
    date: '27 Jun',
    time: '09:15',
    ts: 3,
  },
  {
    id: 'j2',
    author: 'Margaret H.',
    role: 'Patient',
    initial: 'M',
    mood: 'Happy',
    text: 'Spoke with my grandson Oliver on the phone this evening. It made me smile all night.',
    date: '26 Jun',
    time: '20:00',
    ts: 2,
  },
  {
    id: 'j3',
    author: 'Linda Chen',
    role: 'Caregiver',
    initial: 'L',
    mood: 'Concerned',
    text: 'Margaret seemed a little disoriented after lunch. Kept the afternoon calm and quiet, which helped.',
    date: '26 Jun',
    time: '10:00',
    ts: 1,
  },
];

function makeId() {
  return `j-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Load journal entries (seeded defaults the first time). */
export function loadEntries() {
  try {
    const saved = JSON.parse(localStorage.getItem(JOURNAL_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {
    /* ignore malformed storage */
  }
  return DEFAULT_ENTRIES;
}

/** Persist the whole entry list. */
export function saveEntries(entries) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}

/**
 * Build a journal entry from the New Entry form, stamped with the current
 * author and time.
 * @param {{ text: string, mood: string, author: string, role: string }} input
 */
export function makeEntry({ text, mood, author, role }) {
  const now = new Date();
  return {
    id: makeId(),
    author,
    role,
    initial: (author || '?').trim().charAt(0).toUpperCase(),
    mood,
    text: text.trim(),
    date: now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    ts: now.getTime(),
  };
}
