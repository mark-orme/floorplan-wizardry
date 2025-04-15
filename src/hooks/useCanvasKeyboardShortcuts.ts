
/**
 * Hook for handling keyboard shortcuts for canvas operations
 * @module hooks/useCanvasKeyboardShortcuts
 */
import { useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface UseCanvasKeyboardShortcutsProps {
  fabricCanvasRef: { current: FabricCanvas | null };
  undo: () => void;
  redo: () => void;
  deleteSelectedObjects: () => void;
}

/**
 * Hook that provides keyboard shortcuts for canvas operations
 */
export const useCanvasKeyboardShortcuts = ({
  fabricCanvasRef,
  undo,
  redo,
  deleteSelectedObjects
}: UseCanvasKeyboardShortcutsProps) => {
  
  /**
   * Handle keydown events
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore when focus is in input elements
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }
    
    // Ctrl/Cmd + Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    }
    
    // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
      e.preventDefault();
      redo();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      redo();
    }
    
    // Delete key for removing selected objects
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Check if we're in a text input
      if (document.activeElement === document.body) {
        const canvas = fabricCanvasRef.current;
        if (canvas && canvas.getActiveObjects().length > 0) {
          e.preventDefault();
          deleteSelectedObjects();
        }
      }
    }
    
    // Escape key to deselect objects
    if (e.key === 'Escape') {
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    }
  }, [fabricCanvasRef, undo, redo, deleteSelectedObjects]);
  
  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return {
    handleKeyDown
  };
};
