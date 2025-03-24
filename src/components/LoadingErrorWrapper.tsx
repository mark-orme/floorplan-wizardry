
/**
 * Component for handling loading and error states
 * Provides a consistent wrapper for handling async data loading
 * @module LoadingErrorWrapper
 */
import { LoadingError } from "./LoadingError";

/**
 * Props for the LoadingErrorWrapper component
 * @interface LoadingErrorWrapperProps
 */
interface LoadingErrorWrapperProps {
  /** Whether content is currently loading */
  isLoading: boolean;
  
  /** Whether an error has occurred */
  hasError: boolean;
  
  /** Error message to display if hasError is true */
  errorMessage: string;
  
  /** Callback function to retry the operation */
  onRetry: () => void;
  
  /** Child content to render when not loading and no error */
  children: React.ReactNode;
}

/**
 * Component that wraps content with loading and error handling
 * Shows a loading spinner when isLoading is true
 * Shows an error message with retry button when hasError is true
 * Shows children when not loading and no error
 * 
 * @param {LoadingErrorWrapperProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const LoadingErrorWrapper = ({
  isLoading,
  hasError,
  errorMessage,
  onRetry,
  children
}: LoadingErrorWrapperProps) => {
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

  return <>{children}</>;
};

