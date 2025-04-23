
import React from 'react';

interface ErrorFallbackProps {
  error: Error;
  componentStack: string;
  resetError: () => void;
  componentName: string;
}

export function ErrorFallback({ 
  error, 
  componentStack, 
  resetError, 
  componentName 
}: ErrorFallbackProps) {
  return (
    <div className="error-boundary p-4 bg-red-50 text-red-700 rounded-md">
      <h3 className="font-bold">Something went wrong in {componentName}</h3>
      <p>{error.message}</p>
      <button
        className="px-4 py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={resetError}
      >
        Try again
      </button>
    </div>
  );
}
