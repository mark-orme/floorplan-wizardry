
/**
 * Hook for handling keyboard shortcuts for line drawing
 * @module hooks/straightLineTool/useLineKeyboardShortcuts
 */
import { useEffect, useCallback } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';

interface UseLineKeyboardShortcutsProps {
  isActive: boolean;
  isDrawing: boolean;
  cancelDrawing: () => void;
  toggleGridSnapping: () => void;
  tool: DrawingMode;
}

/**
 * Hook for handling keyboard shortcuts for line tools
 */
export function useLineKeyboardShortcuts({
  isActive,
  isDrawing,
  cancelDrawing,
  toggleGridSnapping,
  tool
}: UseLineKeyboardShortcutsProps) {
  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Cancel drawing with Escape key
    if (e.key === 'Escape' && isDrawing) {
      cancelDrawing();
    }
    
    // Only handle shortcuts when the line tool is active
    if (!isActive) return;
    
    // Toggle grid snapping with 'g' key
    if (e.key === 'g') {
      toggleGridSnapping();
      toast.info('Grid snapping toggled');
    }
    
    // Toggle angle snapping with 'a' key
    if (e.key === 'a' && tool === DrawingMode.STRAIGHT_LINE) {
      // This would be implemented with additional props
      // toggleAngleSnapping();
      // toast.info('Angle snapping toggled');
    }
  }, [isActive, isDrawing, cancelDrawing, toggleGridSnapping, tool]);
  
  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return {
    handleKeyDown
  };
}
