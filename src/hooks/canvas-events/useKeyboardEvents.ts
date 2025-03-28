
/**
 * Hook for canvas keyboard events
 * @module canvas-events/useKeyboardEvents
 */
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { EventHandlerResult, UseKeyboardEventsProps } from './types';

/**
 * Hook for handling keyboard events for canvas operations
 * 
 * @param {UseKeyboardEventsProps} props - Properties for the hook
 * @returns {EventHandlerResult} - Event handler result with register/unregister functions
 */
export const useKeyboardEvents = ({
  fabricCanvasRef,
  handleUndo,
  handleRedo,
  deleteSelectedObjects
}: UseKeyboardEventsProps): EventHandlerResult => {
  
  /**
   * Handle keyboard events
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only handle if canvas is available
    if (!fabricCanvasRef.current) return;
    
    // Check if target is an input or textarea to avoid capturing when typing
    const target = e.target as HTMLElement;
    if (target && (
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.isContentEditable
    )) {
      return;
    }
    
    // Handle keyboard shortcuts
    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        // Delete selected objects
        deleteSelectedObjects();
        break;
        
      case 'z':
        // Undo if Ctrl/Cmd+Z
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        }
        break;
        
      case 'y':
        // Redo if Ctrl/Cmd+Y
        if ((e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          handleRedo();
        }
        break;
        
      case 'Z':
      case 'z':
        // Redo if Ctrl/Cmd+Shift+Z
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
          e.preventDefault();
          handleRedo();
        }
        break;
    }
  }, [fabricCanvasRef, handleUndo, handleRedo, deleteSelectedObjects]);
  
  /**
   * Register event handlers
   */
  const register = useCallback(() => {
    window.addEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  /**
   * Unregister event handlers
   */
  const unregister = useCallback(() => {
    window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  /**
   * Clean up resources
   */
  const cleanup = useCallback(() => {
    unregister();
  }, [unregister]);
  
  // Register and cleanup on mount/unmount
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
