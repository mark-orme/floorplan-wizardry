
import { LoadingError } from "./LoadingError";

interface LoadingErrorWrapperProps {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  onRetry: () => void;
  children: React.ReactNode;
}

export const LoadingErrorWrapper = ({
  isLoading,
  hasError,
  errorMessage,
  onRetry,
  children
}: LoadingErrorWrapperProps) => {
  // Show loading or error screen when needed
  if (isLoading || hasError) {
    return (
      <LoadingError 
        isLoading={isLoading}
        hasError={hasError}
        errorMessage={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  // Render children when no loading or error state
  return <>{children}</>;
};
