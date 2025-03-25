
/**
 * Grid error handling module
 * Handles errors and retries for grid creation
 * @module gridErrorHandling
 */
import { Canvas } from "fabric";
import { toast } from "sonner";
import { gridManager } from "../gridManager";

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
  // Clear the safety timeout if exists
  if (gridManager.safetyTimeout) {
    clearTimeout(gridManager.safetyTimeout);
    gridManager.safetyTimeout = null;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.error("Error creating grid:", error);
  }
  
  setHasError(true);
  setErrorMessage(`Error creating grid: ${error.message}`);
  
  // Notify user of the issue with a toast
  toast.error("Grid creation failed. Please try refreshing the page.", {
    id: "grid-error",
    duration: 5000
  });
};

/**
 * Schedule a grid creation retry
 * Uses setTimeout to retry after a delay
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {Function} createGridCallback - Function to create the grid
 * @param {number} delay - Delay before retry in milliseconds
 * @returns {number} Timeout ID
 */
export const scheduleGridRetry = (
  canvas: Canvas,
  createGridCallback: (canvas: Canvas) => void,
  delay: number = 1000
): number => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Scheduling grid retry in ${delay}ms`);
  }
  
  return window.setTimeout(() => {
    if (!canvas) return;
    
    try {
      createGridCallback(canvas);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error in grid retry:", error);
      }
    }
  }, delay);
};
