
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupSentry, initializeApp } from './main/index';

// Import i18n config
import './i18n/config';

// Initialize Sentry first if available
if (typeof setupSentry === 'function') {
  setupSentry();
}

// Initialize the application
if (typeof initializeApp === 'function') {
  initializeApp();
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
