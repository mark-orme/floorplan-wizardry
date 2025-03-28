
/**
 * Grid error handling module
 * Handles errors and retries for grid creation
 * @module grid/errorHandling
 */
import { toast } from "sonner";
import logger from "../logger";
import { TOAST_MESSAGES } from "./constants";

/**
 * Handle grid creation errors
 * Provides error handling and user feedback
 * 
 * @param {Error} error - The error that occurred
 * @param {Function} setHasError - Function to set error state
 * @param {Function} setErrorMessage - Function to set error message
 */
export const handleGridCreationError = (
  error: Error,
  setHasError: (value: boolean) => void,
  setErrorMessage: (value: string) => void
): void => {
  if (process.env.NODE_ENV === 'development') {
    logger.error("Error creating grid:", error);
  }
  
  setHasError(true);
  setErrorMessage(`Error creating grid: ${error.message}`);
  
  // Notify user of the issue with a toast
  toast.error(TOAST_MESSAGES.GRID_CREATION_FAILED, {
    id: "grid-error",
    duration: 5000
  });
};
