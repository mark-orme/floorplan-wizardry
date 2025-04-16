
/**
 * Application entry module
 * Re-exports from main modules
 * @module main
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupSentry, initializeApp } from './main/index';

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
