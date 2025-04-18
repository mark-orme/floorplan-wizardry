
import React from 'react';
import { ThemeProvider } from './components/theme-provider';
import { SentryErrorBoundary } from './utils/sentry/SentryErrorBoundary';
import { DrawingProvider } from './contexts/DrawingContext';
import { FloorPlanEditor } from './components/FloorPlanEditor';
import './index.css';
import './styles/mobile-canvas.css'; // Import mobile styles

function App() {
  return (
    <SentryErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <DrawingProvider>
          <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-1 overflow-hidden">
              <FloorPlanEditor />
            </main>
          </div>
        </DrawingProvider>
      </ThemeProvider>
    </SentryErrorBoundary>
  );
}

export default App;
