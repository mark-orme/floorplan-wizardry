
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initGlobalTypeCheckers } from './utils/debug/globalTypeCheck';
import { initNamingIssueDetection } from './utils/debug/preventNamingIssues';
import { initAppImportChecker } from './utils/debug/appImportChecker';

// Initialize global type checkers and naming checks in development
if (process.env.NODE_ENV !== 'production') {
  initGlobalTypeCheckers();
  initNamingIssueDetection();
  initAppImportChecker();
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
