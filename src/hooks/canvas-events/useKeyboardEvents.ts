
import { useCallback, useEffect } from "react";
import { EventHandlerResult } from "./types";

/**
 * Props for useKeyboardEvents hook
 */
interface UseKeyboardEventsProps {
  /** Function to handle undo operation */
  handleUndo?: () => void;
  /** Function to handle redo operation */
  handleRedo?: () => void;
  /** Function to handle delete operation */
  handleDelete?: () => void;
  /** Function to handle escape key */
  handleEscape?: () => void;
  /** Function to delete selected objects */
  deleteSelectedObjects?: () => void;
}

/**
 * Hook for handling keyboard events
 * @param props - Hook properties
 * @returns Event handler registration and cleanup functions
 */
export const useKeyboardEvents = (props: UseKeyboardEventsProps): EventHandlerResult => {
  const { handleUndo, handleRedo, handleDelete, handleEscape, deleteSelectedObjects } = props;
  
  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check modifiers for Mac/Windows compatibility
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    
    // Handle undo: Ctrl/Cmd + Z
    if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey && handleUndo) {
      e.preventDefault();
      handleUndo();
    }
    
    // Handle redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
    if ((isCtrlOrCmd && e.key === 'z' && e.shiftKey) || 
        (isCtrlOrCmd && e.key === 'y')) {
      e.preventDefault();
      if (handleRedo) handleRedo();
    }
    
    // Handle delete/backspace
    if ((e.key === 'Delete' || e.key === 'Backspace')) {
      // Only prevent default if we're not in an input element
      if (!(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        
        // Use either handleDelete or deleteSelectedObjects based on availability
        if (deleteSelectedObjects) {
          deleteSelectedObjects();
        } else if (handleDelete) {
          handleDelete();
        }
      }
    }
    
    // Handle escape
    if (e.key === 'Escape' && handleEscape) {
      e.preventDefault();
      handleEscape();
    }
  }, [handleUndo, handleRedo, handleDelete, handleEscape, deleteSelectedObjects]);
  
  /**
   * Register keyboard event handlers
   */
  const register = useCallback(() => {
    window.addEventListener('keydown', handleKeyDown);
    console.log("Registering keyboard handlers");
  }, [handleKeyDown]);

  /**
   * Unregister keyboard event handlers
   */
  const unregister = useCallback(() => {
    window.removeEventListener('keydown', handleKeyDown);
    console.log("Unregistering keyboard handlers");
  }, [handleKeyDown]);

  /**
   * Clean up keyboard event handlers
   */
  const cleanup = useCallback(() => {
    unregister();
    console.log("Cleaning up keyboard handlers");
  }, [unregister]);
  
  // Automatically register event handlers on hook initialization
  useEffect(() => {
    register();
    return cleanup;
  }, [register, cleanup]);

  return {
    register,
    unregister,
    cleanup
  };
};
