
/**
 * Hook for handling keyboard events for canvas
 * @module canvas-events/useKeyboardEvents
 */
import { useCallback, useEffect } from 'react';
import { UseKeyboardEventsProps, EventHandlerResult } from './types';

/**
 * Hook for handling keyboard shortcuts for canvas operations
 * 
 * @param {UseKeyboardEventsProps} props - Properties for the hook
 * @returns {EventHandlerResult} - Event handler result
 */
export const useKeyboardEvents = ({
  fabricCanvasRef,
  handleUndo,
  handleRedo,
  deleteSelectedObjects,
  handleEscape,
  handleDelete
}: UseKeyboardEventsProps): EventHandlerResult => {
  
  /**
   * Handle keydown events for canvas shortcuts
   */
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore events when user is typing in an input
    if (e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    // Ctrl/Cmd + Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      if (handleUndo) handleUndo();
    }
    
    // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
    if (((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
      e.preventDefault();
      if (handleRedo) handleRedo();
    }
    
    // Delete or Backspace to delete selected objects
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Let inputs handle their own delete/backspace
      if (document.activeElement === document.body) {
        e.preventDefault();
        if (handleDelete) {
          handleDelete();
        } else if (deleteSelectedObjects) {
          deleteSelectedObjects();
        }
      }
    }
    
    // Escape to deselect or exit current mode
    if (e.key === 'Escape') {
      e.preventDefault();
      if (handleEscape) {
        handleEscape();
      } else if (fabricCanvasRef?.current) {
        // If no custom handler, clear selection
        fabricCanvasRef.current.discardActiveObject();
        fabricCanvasRef.current.renderAll();
      }
    }
  }, [fabricCanvasRef, handleUndo, handleRedo, deleteSelectedObjects, handleEscape, handleDelete]);
  
  /**
   * Register event handlers
   */
  const register = useCallback(() => {
    window.addEventListener('keydown', onKeyDown);
  }, [onKeyDown]);
  
  /**
   * Unregister event handlers
   */
  const unregister = useCallback(() => {
    window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);
  
  // Register and cleanup on mount/unmount
  useEffect(() => {
    register();
    return () => unregister();
  }, [register, unregister]);
  
  return {
    register,
    unregister
  };
};
