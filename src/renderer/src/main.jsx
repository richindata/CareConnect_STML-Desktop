import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/base.css';
import './styles/landing.css';
import './styles/login.css';
import './styles/dashboard.css';

// HashRouter works under the file:// protocol used in packaged Electron apps.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
