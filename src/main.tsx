import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import App from './App.tsx'
import './index.css'
import { getPusher } from './utils/pusher.ts'

// Initialize Sentry for error tracking and monitoring
Sentry.init({
  dsn: "https://abae2c559058eb2bbcd15686dac558ed@o4508914471927808.ingest.de.sentry.io/4509038014234704",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  // Enable automatic release tracking and source maps
  release: import.meta.env.VITE_SENTRY_RELEASE || "development",
  dist: import.meta.env.VITE_SENTRY_DIST,
  environment: import.meta.env.MODE,
  // Tracing
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%
  replaysOnErrorSampleRate: 1.0 // 100% when sampling sessions where errors occur
});

// Initialize Pusher
getPusher();

// Create the root and render the application
createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <App />
  </Sentry.ErrorBoundary>
);
