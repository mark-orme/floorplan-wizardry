
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { setupSentry, initializeApp } from './main/index';
import { initFeatureFlags } from './utils/dynamicImport';
import './index.css';

// Import i18n config - must be before App import to ensure translations are loaded
import './i18n/config';

// Initialize feature flags first
initFeatureFlags({
  enableCollaboration: true,
  enableOfflineMode: true,
  enableAutoSave: true,
  enableGridOptimization: true,
  enableExperimentalTools: false
});

// Initialize Sentry if available
if (typeof setupSentry === 'function') {
  setupSentry();
}

// Initialize the application
if (typeof initializeApp === 'function') {
  initializeApp();
}

// Lazy load the main App component
const App = lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading application...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);
