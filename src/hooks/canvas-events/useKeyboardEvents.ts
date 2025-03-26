
/**
 * Hook for handling keyboard events for canvas
 * @module useKeyboardEvents
 */
import { useEffect } from "react";
import { BaseEventHandlerProps } from "./types";
import logger from "@/utils/logger";

interface UseKeyboardEventsProps extends BaseEventHandlerProps {
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
}

/**
 * Hook to handle keyboard events
 */
export const useKeyboardEvents = ({
  tool,
  deleteSelectedObjects
}: UseKeyboardEventsProps) => {
  useEffect(() => {
    /**
     * Handle keyboard event for delete key
     * @param {KeyboardEvent} e - Keyboard event
     */
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if in select mode
        if (tool === 'select') {
          deleteSelectedObjects();
        }
      }
    };
    
    // Add keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Remove keyboard event listeners
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tool, deleteSelectedObjects]);
};
