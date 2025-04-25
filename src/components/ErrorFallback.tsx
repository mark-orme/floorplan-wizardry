
/**
 * Error Fallback Component
 * Displays when an error boundary catches an error
 * Provides error reporting and recovery options
 * @module components/ErrorFallback
 */
import { useEffect } from 'react';
import { Button } from './ui/button';
import { setTag, setContext, captureError } from '@/utils/sentryUtils';
import * as Sentry from '@sentry/react';
import { captureErrorWithMonitoring } from '@/utils/errorMonitoring';
import { FallbackProps } from 'react-error-boundary';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * ErrorFallback component that displays when an uncaught error occurs
 * Provides user-friendly error message and recovery options
 * Automatically reports errors to monitoring systems
 * 
 * @param {FallbackProps} props - Props from ErrorBoundary
 * @returns {JSX.Element} Error fallback UI
 */
export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRoute = location.pathname;

  // Report error to Sentry when the component mounts
  useEffect(() => {
    // Set Sentry context for critical errors
    setTag("errorType", "critical");
    setTag("errorBoundary", "triggered");
    setTag("route", currentRoute);
    
    setContext("errorBoundaryDetails", {
      message: error.message,
      stack: error.stack,
      route: currentRoute,
      time: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    // Enhanced error reporting with monitoring
    captureErrorWithMonitoring(
      error, 
      'error-boundary', 
      `route:${currentRoute}`,
      {
        tags: {
          component: 'ErrorBoundary',
          level: 'critical',
          route: currentRoute
        },
        context: {
          component: 'ErrorBoundary',
          route: currentRoute,
          operation: 'rendering'
        }
      }
    );
  }, [error, currentRoute]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mx-auto max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="w-12 h-12 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6 text-center">
          We've encountered an error and our team has been notified.
        </p>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => {
              // Set recovery attempt in Sentry
              setTag("recovery", "attempted");
              resetErrorBoundary();
            }}
            className="w-full"
          >
            Try Again
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              // Set navigation recovery in Sentry
              setTag("recovery", "navigation");
              navigate('/');
            }}
            className="w-full"
          >
            Go to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
};
