
import React from 'react';
import { AiOutlineLoading, AiOutlineWarning } from 'react-icons/ai';

interface LoadingErrorWrapperProps {
  isLoading?: boolean;
  error?: Error | null;
  children: React.ReactNode;
  loadingMessage?: string;
  errorFallback?: React.ReactNode;
}

const LoadingErrorWrapper: React.FC<LoadingErrorWrapperProps> = ({
  isLoading = false,
  error = null,
  children,
  loadingMessage = 'Loading...',
  errorFallback
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AiOutlineLoading className="animate-spin h-8 w-8 text-primary mb-4" />
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return errorFallback || (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AiOutlineWarning className="h-8 w-8 text-destructive mb-4" />
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingErrorWrapper;
