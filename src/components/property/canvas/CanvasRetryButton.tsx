
/**
 * Canvas retry button component
 * Displays error state and retry button for canvas initialization failures
 * @module components/property/canvas/CanvasRetryButton
 */
import { AiOutlineReload } from "react-icons/ai";
import { Button } from "@/components/ui/button";

/**
 * Props for the CanvasRetryButton component
 */
interface CanvasRetryButtonProps {
  /** Error message to display */
  errorMessage: string | null;
  /** Handler for retry button click */
  onRetry: () => void;
}

/**
 * Canvas retry button component
 * Displayed when canvas initialization fails
 * 
 * @param {CanvasRetryButtonProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const CanvasRetryButton = ({ errorMessage, onRetry }: CanvasRetryButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 border border-gray-200 rounded-md p-4">
      <p className="text-red-500 mb-2">Canvas initialization failed.</p>
      
      {errorMessage && (
        <p className="text-sm text-gray-700 mb-4">Error: {errorMessage}</p>
      )}
      
      <Button onClick={onRetry} variant="outline">
        <AiOutlineReload className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
};
