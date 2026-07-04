// Shared medication store for the Medications screen. Front-end-only demo data
// (same caveat as tasks.js / auth.js — unencrypted localStorage). Each
// medication carries a 7-day adherence history, one entry per weekday
// (Monday → Sunday), used to draw the "Last 7 Days" strip:
//
//   'taken'   → dose recorded (green)
//   'missed'  → dose not taken on a past day (pink)
//   'pending' → not recorded yet (neutral) — today before it is marked, or a
//               brand-new medication with no history
const MEDS_KEY = 'careconnect.meds';

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const PRESCRIBER = { name: 'Dr. Sarah Chen', reviewed: '10 Jun 2026' };

// The refill warning shown in the header.
export const REFILL_ALERT = { med: 'Metformin', days: 7 };

// Index into WEEK_DAYS for "today" (Mon = 0 … Sun = 6), so the current day's
// column is the one highlighted and interactive.
export function todayIndex(date = new Date()) {
  return (date.getDay() + 6) % 7;
}

const DEFAULT_MEDS = [
  {
    id: 'donepezil',
    name: 'Donepezil',
    category: 'Memory & cognition',
    dose: '10 mg',
    schedule: '08:00 AM',
    // Mon → Sun
    week: ['taken', 'taken', 'taken', 'taken', 'taken', 'taken', 'taken'],
  },
  {
    id: 'lisinopril',
    name: 'Lisinopril',
    category: 'Blood pressure',
    dose: '5 mg',
    schedule: '08:00 AM',
    week: ['taken', 'taken', 'taken', 'taken', 'pending', 'taken', 'missed'],
  },
  {
    id: 'metformin',
    name: 'Metformin',
    category: 'Blood sugar',
    dose: '500 mg',
    schedule: '08:00 AM & 6:00 PM',
    week: ['taken', 'missed', 'taken', 'taken', 'pending', 'taken', 'missed'],
  },
];

function makeId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Load the medication list (seeded defaults the first time). */
export function loadMeds() {
  try {
    const saved = JSON.parse(localStorage.getItem(MEDS_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {
    /* ignore malformed storage */
  }
  return DEFAULT_MEDS;
}

/** Persist the whole medication list. */
export function saveMeds(meds) {
  localStorage.setItem(MEDS_KEY, JSON.stringify(meds));
}

/**
 * Build a new medication from the Add Medication dialog. It starts with no
 * adherence history (every day 'pending') so today can be marked straight away.
 * @param {{ name: string, category?: string, dose?: string, schedule?: string }} input
 */
export function makeMed(input) {
  return {
    id: makeId(),
    name: input.name.trim(),
    category: (input.category || '').trim() || 'General',
    dose: (input.dose || '').trim(),
    schedule: (input.schedule || '').trim(),
    week: Array(7).fill('pending'),
  };
}
