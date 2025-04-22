
import { useEffect } from "react";
import { Button } from "./ui/button";
import { captureError } from "@/utils/sentryUtils";

interface LoadingErrorProps {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  onRetry: () => void;
}

export const LoadingError = ({
  isLoading,
  hasError,
  errorMessage,
  onRetry
}: LoadingErrorProps) => {
  // Report error to Sentry when an error occurs
  useEffect(() => {
    if (hasError && errorMessage) {
      captureError(new Error(errorMessage), {
        tags: { 
          context: 'loading-error',
          component: 'LoadingError'
        },
        extra: {
          errorMessage
        }
      });
    }
  }, [hasError, errorMessage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Loading your floor plans...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
            ⚠️
          </div>
          <p className="text-lg text-red-600">Error: {errorMessage}</p>
          <Button 
            className="mt-4"
            onClick={onRetry}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
