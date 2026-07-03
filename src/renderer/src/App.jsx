import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import AppShell from './pages/app/AppShell.jsx';
import Home from './pages/app/Home.jsx';
import Placeholder from './pages/app/Placeholder.jsx';

export default function App() {
  const navigate = useNavigate();

  // Bridge native-menu navigation into React Router.
  useEffect(() => {
    if (!window.careconnect?.onNavigate) return;
    const unsubscribe = window.careconnect.onNavigate((to) => navigate(to));
    return unsubscribe;
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/app" element={<AppShell />}>
        <Route index element={<Home />} />
        <Route
          path="daily-plan"
          element={<Placeholder icon="📅" title="Daily Plan" description="Your full schedule of tasks for morning, afternoon and evening." />}
        />
        <Route
          path="medications"
          element={<Placeholder icon="💊" title="Medications" description="Track every medication with taken / pending status and refill alerts." />}
        />
        <Route
          path="reminders"
          element={<Placeholder icon="🔔" title="Reminders" description="Gentle, plain-language alerts delivered throughout your day." />}
        />
        <Route
          path="journal"
          element={<Placeholder icon="📖" title="Journal" description="A shared log with mood check-ins, notes and history." />}
        />
        <Route
          path="settings"
          element={<Placeholder icon="⚙️" title="Settings" description="Preferences, accessibility options and caregiver access." />}
        />
      </Route>
    </Routes>
  );
}
