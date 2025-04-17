
import React, { useEffect } from "react";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { FloorPlanEditor } from "@/components/FloorPlanEditor";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { isRTL } from "@/i18n/config";
import logger from "@/utils/logger";
import { initializeSentry, configureSentryContext } from "@/utils/sentry/initialization";
import * as Sentry from '@sentry/react';

// Initialize Sentry as early as possible
initializeSentry();

// Create a Sentry error boundary component
const SentryErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <Sentry.ErrorBoundary
    fallback={({ error, componentStack, resetError }) => (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
        <p className="text-red-700 mb-4">An error occurred in the application.</p>
        <button
          onClick={resetError}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    )}
  >
    {children}
  </Sentry.ErrorBoundary>
);

function App() {
  const { t, i18n } = useTranslation();
  
  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = isRTL() ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    logger.info(`Language changed to ${i18n.language}, direction: ${isRTL() ? 'rtl' : 'ltr'}`);
    
    // Update Sentry context with locale information
    configureSentryContext({
      locale: i18n.language,
    });
  }, [i18n.language]);
  
  return (
    <SentryErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <DrawingProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
              <h1 className="text-xl font-bold">{t('app.title')}</h1>
              <LanguageSwitcher />
            </header>
            <main className="flex-1 overflow-hidden">
              <FloorPlanEditor />
            </main>
          </div>
          <Toaster />
        </DrawingProvider>
      </ThemeProvider>
    </SentryErrorBoundary>
  );
}

export default App;
