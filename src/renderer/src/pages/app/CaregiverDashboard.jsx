import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../lib/auth.js';
import { loadTasks, saveTasks, makeTask } from '../../lib/tasks.js';
import { onNew } from '../../lib/appEvents.js';
import AddTaskModal from './AddTaskModal.jsx';

const MRN = 'MRN-00421';

const STATS = [
  { label: 'Medications', value: '2 / 3 taken', tone: 'amber' },
  { label: 'Tasks Done', value: '2 / 6', tone: 'blue' },
  { label: 'Mood Today', value: '😌 Calm', tone: 'green' },
  { label: 'Missed Doses 7d', value: '2', tone: 'red' },
];

export default function CaregiverDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(loadTasks);
  const [showAddTask, setShowAddTask] = useState(false);

  // The person who signed in with a password is the caregiver.
  const user = getCurrentUser();
  const caregiverName = user?.name || 'Caregiver';

  // Persist tasks whenever they change (shared with the patient's Today's Plan).
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Open the "Add New Task" modal.
  const addTask = useCallback(() => setShowAddTask(true), []);

  // Called by the modal when a task is confirmed.
  const handleAddTask = useCallback((task) => {
    setTasks((prev) => [...prev, makeTask(task)]);
  }, []);

  const toggle = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const callPatient = () => window.alert('Calling patient…');

  // Page-specific shortcut: Ctrl/Cmd+N adds a task.
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

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div className="dashboard">
      {/* Caregiver hero */}
      <section className="hero-banner hero-banner--caregiver">
        <div>
          <p className="hero-banner__eyebrow">〰 Caregiver Dashboard</p>
          <h1 className="hero-banner__patient">{caregiverName}</h1>
          <p className="hero-banner__progress">
            {remaining} task{remaining === 1 ? '' : 's'} remaining · Last active 20 min ago · {MRN}
          </p>
        </div>
        <div className="hero-actions">
          <button className="hero-btn hero-btn--green" onClick={addTask}>+ Add Task</button>
          <button className="hero-btn hero-btn--white" onClick={callPatient}>📞 Call Patient</button>
        </div>
      </section>

      {/* Stat cards */}
      <div className="stats-grid">
        {STATS.map((s) => (
          <div className="stat-card" key={s.label}>
            <p className="stat-card__label">{s.label}</p>
            <p className={`stat-card__value stat-card__value--${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="dash-cols">
        <section className="panel">
          <h2 className="panel__title">Task Status</h2>
          <ul className="task-list">
            {tasks.map((t) => (
              <li key={t.id} className={`task-row ${t.done ? 'is-done' : ''}`}>
                <button
                  className="task-row__check"
                  onClick={() => toggle(t.id)}
                  aria-pressed={t.done}
                  aria-label={`${t.done ? 'Mark not done' : 'Mark done'}: ${t.label}`}
                >
                  {t.done ? '✓' : ''}
                </button>
                <span className="task-row__label">{t.label}</span>
                <span className="task-row__time">{t.time}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Latest Journal</h2>
            <button className="panel__link" onClick={() => navigate('/app/journal')}>View all →</button>
          </div>
          <div className="journal-entry">
            <div className="journal-entry__head">
              <span className="journal-entry__author">{caregiverName} · Caregiver</span>
              <span className="journal-entry__time">Today 09:15</span>
            </div>
            <span className="mood-pill">😌 Calm</span>
            <div className="redact" />
            <div className="redact redact--short" />
          </div>
        </section>
      </div>

      {showAddTask && (
        <AddTaskModal onAdd={handleAddTask} onClose={() => setShowAddTask(false)} />
      )}
    </div>
  );
}
