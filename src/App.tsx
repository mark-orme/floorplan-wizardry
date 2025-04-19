
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { SentryErrorBoundary } from './utils/sentry/SentryErrorBoundary';
import { DrawingProvider } from './contexts/DrawingContext';
import { FloorPlanEditor } from './components/FloorPlanEditor';
import { Toaster } from './components/ui/sonner';
import './index.css';
import './styles/mobile-canvas.css'; // Import mobile styles

function App() {
  return (
    <Router>
      <SentryErrorBoundary>
        <ThemeProvider defaultTheme="light" attribute="class" storageKey="ui-theme">
          <DrawingProvider>
            <div className="flex flex-col min-h-screen bg-background">
              <main className="flex-1 overflow-hidden">
                <FloorPlanEditor />
              </main>
            </div>
            <Toaster />
          </DrawingProvider>
        </ThemeProvider>
      </SentryErrorBoundary>
    </Router>
  );
}

export default App;
