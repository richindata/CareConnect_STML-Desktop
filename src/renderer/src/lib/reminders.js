// Shared reminders store for the Reminders screen. Front-end-only demo data
// (same caveat as tasks.js / meds.js — unencrypted localStorage). Persisted so
// reminders, done state and snoozes survive a restart.
const REM_KEY = 'careconnect.reminders';

export const TYPES = ['Medication', 'Appointment', 'Social', 'Activity'];

// Type → badge tone (shares the .type-badge--* colours with the Daily Plan).
export const TYPE_TONE = {
  Medication: 'medication',
  Appointment: 'appointment',
  Social: 'social',
  Activity: 'activity',
};

// Options for the "Date / Repeat" select in the New Reminder form.
export const REPEATS = ['Once', 'Daily', 'Weekdays', 'Weekly Fri', 'Mon · Wed · Fri', 'Sundays'];

const DEFAULT_REMINDERS = [
  { id: 'r1', text: 'Lunch with Linda', time: '12:00 PM', type: 'Social', repeat: 'Weekly Fri', alert: true, done: false },
  { id: 'r2', text: 'Afternoon walk in the garden', time: '02:00 PM', type: 'Activity', repeat: 'Daily', alert: true, done: false },
  { id: 'r3', text: 'Linda will call you', time: '03:00 PM', type: 'Social', repeat: 'Mon · Wed · Fri', alert: true, done: false },
  { id: 'r4', text: 'Take Metformin 500 mg', time: '06:00 PM', type: 'Medication', repeat: 'Daily', alert: true, done: false },
  { id: 'r5', text: 'Call grandson Oliver', time: '08:00 PM', type: 'Social', repeat: 'Sundays', alert: false, done: false },
  { id: 'r6', text: 'Take Donepezil 10 mg', time: '08:00 AM', type: 'Medication', repeat: 'Daily', alert: true, done: true },
  { id: 'r7', text: 'Take Lisinopril 5 mg', time: '08:00 AM', type: 'Medication', repeat: 'Daily', alert: true, done: true },
  { id: 'r8', text: 'Video call with Dr. Chen', time: '09:30 AM', type: 'Appointment', repeat: 'Once', alert: true, done: true },
];

// Recurring reminders shown in the right-hand "Recurring Reminders" panel.
export const RECURRING = [
  { id: 'rc1', title: 'Morning medications', detail: 'Daily · 08:00 AM' },
  { id: 'rc2', title: 'Evening medications', detail: 'Daily · 06:00 PM' },
  { id: 'rc3', title: 'Lunch with Linda', detail: 'Every Friday · 12:00 PM' },
];

function makeId() {
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Load the reminders (seeded defaults the first time). */
export function loadReminders() {
  try {
    const saved = JSON.parse(localStorage.getItem(REM_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {
    /* ignore malformed storage */
  }
  return DEFAULT_REMINDERS;
}

/** Persist the whole reminders list. */
export function saveReminders(reminders) {
  localStorage.setItem(REM_KEY, JSON.stringify(reminders));
}

/**
 * Build a reminder from the New Reminder form.
 * @param {{ text: string, time?: string, type?: string, repeat?: string, alert?: boolean }} input
 */
export function makeReminder(input) {
  return {
    id: makeId(),
    text: input.text.trim(),
    time: (input.time || '08:00 AM').trim(),
    type: input.type || 'Medication',
    repeat: input.repeat || 'Once',
    alert: input.alert !== false,
    done: false,
  };
}

/** "08:00 AM" → minutes since midnight (for sorting / snoozing). */
export function timeToMinutes(t) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)?/i.exec((t || '').trim());
  if (!m) return 0;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ap = m[3]?.toUpperCase();
  if (ap === 'PM' && h < 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

/** minutes since midnight → "08:10 AM". */
export function minutesToTime(mins) {
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const ap = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ap}`;
}
