
/**
 * Hook for keyboard shortcuts specific to the straight line tool
 */
import { useCallback, useEffect } from 'react';
import { DrawingMode } from '@/constants/drawingModes';

interface UseLineKeyboardShortcutsProps {
  isActive: boolean;
  isDrawing: boolean;
  cancelDrawing: () => boolean;
  toggleGridSnapping: () => boolean;
  tool: DrawingMode;
}

/**
 * Hook for keyboard shortcuts specific to the line tool
 */
export const useLineKeyboardShortcuts = ({
  isActive,
  isDrawing,
  cancelDrawing,
  toggleGridSnapping,
  tool
}: UseLineKeyboardShortcutsProps) => {
  // Handle keyboard events - primarily for ESC to cancel and G for grid snapping
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return;
    
    // Cancel drawing on Escape key
    if (e.key === 'Escape') {
      if (isDrawing) {
        const cancelled = cancelDrawing();
        if (cancelled) {
          console.log('Drawing cancelled via keyboard shortcut');
        }
      }
    }
    
    // Toggle grid snapping on G key
    if (e.key === 'g' || e.key === 'G') {
      const isEnabled = toggleGridSnapping();
      console.log(`Grid snapping ${isEnabled ? 'enabled' : 'disabled'} via keyboard shortcut`);
    }
  }, [isActive, isDrawing, cancelDrawing, toggleGridSnapping]);
  
  // Add and remove keyboard event listener
  useEffect(() => {
    if (isActive) {
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isActive, handleKeyDown]);
  
  return { handleKeyDown };
};
