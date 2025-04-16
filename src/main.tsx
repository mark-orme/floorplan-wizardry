
/**
 * Application entry point
 * @module main
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { setupSentry, initializeApp } from './main';
import { createQueryClient } from './main/appInitialization';

// Initialize Sentry
setupSentry(
  import.meta.env.VITE_SENTRY_DSN,
  import.meta.env.MODE,
  import.meta.env.VITE_APP_VERSION || '1.0.0'
);

// Initialize application
initializeApp();

// Create React Query client
const queryClient = createQueryClient();

// Render the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <App />
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
