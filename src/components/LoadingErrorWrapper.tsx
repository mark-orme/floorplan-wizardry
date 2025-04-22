
import React from 'react';

interface LoadingErrorWrapperProps {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = ({
  isLoading,
  hasError,
  errorMessage,
  onRetry,
  children
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-destructive text-lg mb-4">{errorMessage || 'An error occurred'}</div>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
