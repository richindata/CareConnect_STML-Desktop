// Shared task store used by BOTH dashboards:
//   • Caregiver home  → "Task Status"
//   • Patient home    → "Today's Plan"
// A task added through the Add New Task dialog is written here once and shows up
// in both places. Persisted in localStorage so it survives a restart.
//
// NOTE: Front-end-only demo store (same caveat as auth.js — unencrypted, shared
// across accounts on this machine).
const TASKS_KEY = 'careconnect.tasks';

const DEFAULT_TASKS = [
  { id: 't1', label: 'Take morning medications', time: '08:00', type: 'Medication', done: true },
  { id: 't2', label: 'Video call with Dr. Chen', time: '09:30', type: 'Appointment', done: true },
  { id: 't3', label: 'Lunch with Linda', time: '12:00', type: 'Social', done: false },
  { id: 't4', label: 'Walk in the garden', time: '14:00', type: 'Activity', done: false },
  { id: 't5', label: 'Take evening medications', time: '18:00', type: 'Medication', done: false },
  { id: 't6', label: 'Call grandson Oliver', time: '20:00', type: 'Social', done: false },
];

function makeId() {
  return `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Load the task list (seeded defaults the first time). */
export function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(TASKS_KEY));
    if (Array.isArray(saved) && saved.length) {
      // Backfill ids for any tasks stored before the shared store existed.
      return saved.map((t) => (t.id ? t : { ...t, id: makeId() }));
    }
  } catch {
    /* ignore malformed storage */
  }
  return DEFAULT_TASKS;
}

/** Persist the whole task list. */
export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

/**
 * Normalise a task coming from the Add New Task dialog and give it an id.
 * @param {{ label: string, date?: string, time?: string, type?: string, notes?: string }} input
 */
export function makeTask(input) {
  return {
    id: makeId(),
    label: input.label,
    date: input.date || '',
    time: input.time || '',
    type: input.type || '',
    notes: input.notes || '',
    done: false,
  };
}
