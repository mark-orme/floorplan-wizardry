
import React from 'react';
import * as Sentry from '@sentry/react';
import { ErrorBoundary } from '../canvas/errorBoundary';
import { handleError } from '../errorHandlingUtils';

interface SentryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

/**
 * SentryErrorBoundary component that combines our custom ErrorBoundary
 * with Sentry's error reporting capabilities
 * 
 * @param {SentryErrorBoundaryProps} props - Component props
 * @returns {JSX.Element} Error boundary wrapped children
 */
export const SentryErrorBoundary: React.FC<SentryErrorBoundaryProps> = ({ 
  children, 
  fallback,
  componentName = 'RootApplication'
}) => {
  // Handle error with our unified error handler
  const handleSentryError = (error: Error) => {
    handleError(error, 'error', {
      component: componentName,
      operation: 'render'
    });
  };

  return (
    <Sentry.ErrorBoundary 
      fallback={({ error }) => {
        // Handle the error before showing fallback
        handleSentryError(error);
        
        return fallback || (
          <ErrorBoundary 
            componentName={componentName}
            captureErrors={true}
            fallback={
              <div className="p-4 flex flex-col items-center justify-center min-h-screen">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
                  <h2 className="text-red-800 text-lg font-semibold mb-2">Application Error</h2>
                  <p className="text-red-700 mb-4">
                    Something went wrong with the application. Our team has been notified.
                  </p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded-md transition-colors"
                  >
                    Reload Application
                  </button>
                </div>
              </div>
            }
          >
            {children}
          </ErrorBoundary>
        );
      }}
      beforeCapture={(scope) => {
        scope.setTag('component', componentName);
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};
