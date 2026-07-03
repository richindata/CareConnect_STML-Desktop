import { getMode } from '../../lib/auth.js';
import Dashboard from './Dashboard.jsx';
import CaregiverDashboard from './CaregiverDashboard.jsx';

// The Home tab shows the patient dashboard for a PIN login and the caregiver
// dashboard for a password login.
export default function Home() {
  return getMode() === 'caregiver' ? <CaregiverDashboard /> : <Dashboard />;
}
