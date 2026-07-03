import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadTasks, saveTasks } from '../../lib/tasks.js';

const MEMORY_PROMPTS = [
  { q: 'What year were you born?', a: '1952 — You are 73 this year.' },
  { q: "What is today's date?", a: null },
  { q: 'Where do you live?', a: '24 Maple Street, Boston.' },
];

const MEDICATIONS = [
  { name: 'Donepezil', dose: '10 mg', status: 'taken' },
  { name: 'Lisinopril', dose: '5 mg', status: 'taken' },
  { name: 'Metformin', dose: '500 mg', status: 'pending' },
];

function greeting(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const firstName = 'there';

  // Live clock — updates every second (common desktop pattern).
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Shared task store — tasks added from the caregiver's Add New Task dialog
  // appear here in the patient's Today's Plan too.
  const [plan, setPlan] = useState(loadTasks);
  useEffect(() => {
    saveTasks(plan);
  }, [plan]);

  const [openPrompt, setOpenPrompt] = useState(0);

  const togglePlan = (id) =>
    setPlan((prev) => prev.map((p) => (p.id === id ? { ...p, done: !p.done } : p)));

  const remaining = plan.filter((p) => !p.done).length;
  const longDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const clock = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="dashboard">
      {/* Hero banner */}
      <section className="hero-banner">
        <div>
          <p className="hero-banner__greeting">☀ {greeting(now.getHours())}, {firstName}.</p>
          <h1 className="hero-banner__date">{longDate}</h1>
          <p className="hero-banner__progress">
            {remaining > 0
              ? `You have ${remaining} thing${remaining === 1 ? '' : 's'} left to do today. You are doing great!`
              : 'All done for today. Wonderful job!'}
          </p>
        </div>
        <div className="hero-banner__clock">{clock}</div>
      </section>

      {/* Two-column row */}
      <div className="dash-cols">
        <section className="panel">
          <h2 className="panel__title">Today's Plan</h2>
          <ul className="plan-list">
            {plan.map((item) => (
              <li key={item.id} className={`plan-item ${item.done ? 'is-done' : ''}`}>
                <button
                  className="plan-item__check"
                  onClick={() => togglePlan(item.id)}
                  aria-pressed={item.done}
                  aria-label={`${item.done ? 'Mark not done' : 'Mark done'}: ${item.label}`}
                >
                  {item.done ? '✓' : ''}
                </button>
                <div className="plan-item__text">
                  <span className="plan-item__label">{item.label}</span>
                  <span className="plan-item__time">{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
          <button className="link-arrow" onClick={() => navigate('/app/daily-plan')}>
            View full plan →
          </button>
        </section>

        <section className="panel">
          <h2 className="panel__title">Memory Prompts</h2>
          <div className="prompt-list">
            {MEMORY_PROMPTS.map((prompt, i) => {
              const isOpen = openPrompt === i;
              return (
                <button
                  key={prompt.q}
                  className={`prompt-card ${isOpen ? 'is-open' : ''}`}
                  onClick={() => setOpenPrompt(isOpen ? -1 : i)}
                >
                  <span className="prompt-card__q">{prompt.q}</span>
                  {isOpen && (
                    <span className="prompt-card__a">
                      {prompt.a || now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="panel__foot">Tap a card to reveal the answer.</p>
        </section>
      </div>

      {/* Medications strip */}
      <section className="panel meds-panel">
        <h2 className="panel__title">Medications Today</h2>
        <div className="meds-grid">
          {MEDICATIONS.map((med) => (
            <div key={med.name} className={`med-card med-card--${med.status}`}>
              <div className="med-card__top">
                <span className="med-card__icon" aria-hidden="true">💊</span>
                <span className={`status-badge status-badge--${med.status}`}>
                  <span className="status-badge__dot" /> {med.status === 'taken' ? 'Taken' : 'Pending'}
                </span>
              </div>
              <p className="med-card__name">{med.name}</p>
              <p className="med-card__dose">{med.dose}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
