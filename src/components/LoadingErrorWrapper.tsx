
import React from 'react';

interface LoadingErrorWrapperProps {
  isLoading: boolean;
  error: Error | null;
  children: React.ReactNode;
}

const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = ({
  isLoading,
  error,
  children
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-lg font-medium text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingErrorWrapper;
