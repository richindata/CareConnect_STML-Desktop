import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadTasks, saveTasks, makeTask } from '../../lib/tasks.js';
import { onNew } from '../../lib/appEvents.js';
import AddTaskModal from './AddTaskModal.jsx';

// The day is split into fixed parts. Each task is filed by the hour it is
// scheduled; tasks with no recognisable time fall into "Anytime".
const SECTIONS = [
  { key: 'morning', label: 'Morning', icon: '☀️', range: 'Before 12:00 PM', test: (m) => m != null && m < 12 * 60 },
  { key: 'afternoon', label: 'Afternoon', icon: '🌤️', range: '12:00 – 6:00 PM', test: (m) => m != null && m >= 12 * 60 && m < 18 * 60 },
  { key: 'evening', label: 'Evening', icon: '🌙', range: 'After 6:00 PM', test: (m) => m != null && m >= 18 * 60 },
  { key: 'anytime', label: 'Anytime', icon: '🗓️', range: 'No set time', test: (m) => m == null },
];

// Task type → badge tone (colours live in dashboard.css).
const TYPE_TONE = {
  Medication: 'medication',
  Appointment: 'appointment',
  Social: 'social',
  Activity: 'activity',
};

// Parse "08:00", "8:00 PM", "08:00 AM" → minutes since midnight (or null).
function toMinutes(time) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?/i.exec((time || '').trim());
  if (!match) return null;
  let hour = Number(match[1]);
  const min = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  return hour * 60 + min;
}

/**
 * The patient's full Daily Plan — the screen reached from the sidebar, the
 * toolbar tabs and the native View → Daily Plan menu (all route to
 * /app/daily-plan). Reads the shared task store so tasks added by a caregiver
 * show up here too.
 */
export default function DailyPlan() {
  const [tasks, setTasks] = useState(loadTasks);
  const [showAddTask, setShowAddTask] = useState(false);

  // Persist to the shared store whenever the plan changes.
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback(() => setShowAddTask(true), []);
  const handleAddTask = useCallback((task) => setTasks((prev) => [...prev, makeTask(task)]), []);
  const toggle = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  // Page shortcut: Ctrl/Cmd+N opens the Add Task dialog (matches the button hint).
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        addTask();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [addTask]);

  // Native menu / in-window menu bar → "New".
  useEffect(() => onNew(addTask), [addTask]);

  // Bucket tasks into the day's sections, each sorted chronologically.
  const grouped = useMemo(() => {
    const timed = tasks.map((t) => ({ ...t, mins: toMinutes(t.time) }));
    return SECTIONS.map((section) => ({
      ...section,
      items: timed
        .filter((t) => section.test(t.mins))
        .sort((a, b) => (a.mins ?? 0) - (b.mins ?? 0)),
    }));
  }, [tasks]);

  const doneCount = tasks.filter((t) => t.done).length;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="daily-plan">
      <header className="page-head">
        <div>
          <h1 className="page-head__title">Daily Plan</h1>
          <p className="page-head__sub">
            {today} · {doneCount} / {tasks.length} done
          </p>
        </div>
        <button className="hero-btn hero-btn--navy add-task-btn" onClick={addTask}>
          + Add Task <kbd className="kbd-hint">Ctrl+N</kbd>
        </button>
      </header>

      {grouped.map((section) =>
        // Only show "Anytime" when something actually lands there.
        section.key === 'anytime' && section.items.length === 0 ? null : (
          <section className="plan-section" key={section.key}>
            <div className="plan-section__head">
              <span className="plan-section__icon" aria-hidden="true">{section.icon}</span>
              <h2 className="plan-section__title">{section.label}</h2>
              <span className="plan-section__range">{section.range}</span>
            </div>

            {section.items.length === 0 ? (
              <p className="plan-section__empty">Nothing scheduled.</p>
            ) : (
              <ul className="plan-cards">
                {section.items.map((item) => (
                  <li key={item.id} className={`plan-card ${item.done ? 'is-done' : ''}`}>
                    <button
                      className="plan-card__check"
                      onClick={() => toggle(item.id)}
                      aria-pressed={item.done}
                      aria-label={`${item.done ? 'Mark not done' : 'Mark done'}: ${item.label}`}
                    >
                      {item.done ? '✓' : ''}
                    </button>
                    <div className="plan-card__text">
                      <span className="plan-card__label">{item.label}</span>
                      <span className="plan-card__time">🕐 {item.time || 'Anytime'}</span>
                    </div>
                    {item.type && (
                      <span className={`type-badge type-badge--${TYPE_TONE[item.type] || 'activity'}`}>
                        {item.type}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      )}

      {showAddTask && (
        <AddTaskModal onAdd={handleAddTask} onClose={() => setShowAddTask(false)} />
      )}
    </div>
  );
}
