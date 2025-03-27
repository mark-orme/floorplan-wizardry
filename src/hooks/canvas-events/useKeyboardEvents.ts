
/**
 * Hook for handling keyboard events for canvas
 * Provides keyboard shortcut functionality for canvas operations
 * @module useKeyboardEvents
 */
import { useEffect } from "react";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";
import logger from "@/utils/logger";

/**
 * Props for useKeyboardEvents hook
 * @interface UseKeyboardEventsProps
 * @extends BaseEventHandlerProps
 */
interface UseKeyboardEventsProps extends BaseEventHandlerProps {
  /** Function to delete selected objects */
  deleteSelectedObjects: () => void;
  /** Function to handle undo operation */
  handleUndo?: () => void;
  /** Function to handle redo operation */
  handleRedo?: () => void;
}

/**
 * Hook to handle keyboard events
 * Sets up event listeners for keyboard shortcuts like delete/backspace
 * 
 * @param {UseKeyboardEventsProps} props - Hook properties
 * @returns {EventHandlerResult} Cleanup function
 * 
 * @example
 * useKeyboardEvents({
 *   tool,
 *   fabricCanvasRef,
 *   deleteSelectedObjects
 * });
 */
export const useKeyboardEvents = ({
  tool,
  deleteSelectedObjects,
  handleUndo,
  handleRedo
}: UseKeyboardEventsProps): EventHandlerResult => {
  useEffect(() => {
    /**
     * Handle keyboard event for delete key
     * Deletes selected objects when in select mode
     * 
     * @param {KeyboardEvent} e - Keyboard event
     */
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if in select mode
        if (tool === 'select') {
          deleteSelectedObjects();
        }
      } else if (e.key === 'z' && e.ctrlKey) {
        // Undo operation
        if (handleUndo) {
          handleUndo();
        }
      } else if (e.key === 'y' && e.ctrlKey) {
        // Redo operation
        if (handleRedo) {
          handleRedo();
        }
      }
    };
    
    // Add keyboard event listeners
    window.addEventListener('keydown', handleKeyDown);
    
    // Remove keyboard event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tool, deleteSelectedObjects, handleUndo, handleRedo]);

  return {
    cleanup: () => {
      logger.debug("Keyboard events cleanup");
    }
  };
};
