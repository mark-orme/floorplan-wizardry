
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseCanvasKeyboardShortcutsProps {
  canvas: FabricCanvas | null;
  undo: () => void;
  redo: () => void;
  deleteSelected?: () => void;
}

/**
 * Hook for handling keyboard shortcuts for canvas operations
 */
export const useCanvasKeyboardShortcuts = ({
  canvas,
  undo,
  redo,
  deleteSelected
}: UseCanvasKeyboardShortcutsProps) => {
  /**
   * Handle keyboard events for shortcuts
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Skip if focus is in an input element
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }
    
    // Undo: Ctrl/Cmd + Z
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      logger.debug('Keyboard shortcut: Undo');
      undo();
    }
    
    // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
    if (((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
      e.preventDefault();
      logger.debug('Keyboard shortcut: Redo');
      redo();
    }
    
    // Delete: Delete or Backspace key
    if (deleteSelected && (e.key === 'Delete' || e.key === 'Backspace')) {
      // Only if we're not in an input field and active element is the body
      if (document.activeElement === document.body) {
        // Only delete if there are objects selected
        if (canvas && canvas.getActiveObjects().length > 0) {
          e.preventDefault();
          logger.debug('Keyboard shortcut: Delete');
          deleteSelected();
        }
      }
    }
    
    // Escape: deselect objects
    if (e.key === 'Escape' && canvas) {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      logger.debug('Keyboard shortcut: Escape (deselect)');
    }
  }, [canvas, undo, redo, deleteSelected]);
  
  // Register and clean up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    logger.debug('Keyboard shortcuts registered');
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      logger.debug('Keyboard shortcuts unregistered');
    };
  }, [handleKeyDown]);
  
  return {
    handleKeyDown
  };
};
