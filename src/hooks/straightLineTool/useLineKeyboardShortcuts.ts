
/**
 * Hook for handling keyboard shortcuts related to line drawing
 * @module hooks/straightLineTool/useLineKeyboardShortcuts
 */
import { useCallback, useEffect } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import * as Sentry from '@sentry/react';

interface UseLineKeyboardShortcutsProps {
  isActive: boolean;
  isDrawing: boolean;
  cancelDrawing: () => void;
  toggleGridSnapping: () => void;
  toggleAngles?: () => void;
  toggleStraightening?: () => void;
  tool: DrawingMode;
}

export const useLineKeyboardShortcuts = ({
  isActive,
  isDrawing,
  cancelDrawing,
  toggleGridSnapping,
  toggleAngles,
  toggleStraightening,
  tool
}: UseLineKeyboardShortcutsProps) => {

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only process shortcuts when tool is active
    if (!isActive) return;
    
    try {
      // Cancel drawing with Escape key
      if (e.key === 'Escape') {
        if (isDrawing) {
          cancelDrawing();
          toast.info('Drawing cancelled', { id: 'drawing-cancelled' });
          
          // Log to Sentry
          Sentry.addBreadcrumb({
            category: 'user-action',
            message: 'Line drawing cancelled with Escape key',
            level: 'info'
          });
        }
      }
      
      // Toggle grid snapping with G key
      if (e.key === 'g' || e.key === 'G') {
        if (!e.repeat) { // Avoid repeat events when key is held down
          toggleGridSnapping();
          
          // Log to Sentry
          Sentry.addBreadcrumb({
            category: 'user-action',
            message: 'Grid snapping toggled with G key',
            level: 'info'
          });
        }
      }
      
      // Toggle angle snapping with A key
      if ((e.key === 'a' || e.key === 'A') && toggleAngles) {
        if (!e.repeat) { // Avoid repeat events when key is held down
          toggleAngles();
          
          // Log to Sentry
          Sentry.addBreadcrumb({
            category: 'user-action',
            message: 'Angle snapping toggled with A key',
            level: 'info'
          });
        }
      }
      
      // Toggle line straightening with S key
      if ((e.key === 's' || e.key === 'S') && toggleStraightening) {
        if (!e.repeat) { // Avoid repeat events when key is held down
          toggleStraightening();
          
          // Log to Sentry
          Sentry.addBreadcrumb({
            category: 'user-action',
            message: 'Line straightening toggled with S key',
            level: 'info'
          });
        }
      }
    } catch (error) {
      // Log error to Sentry
      Sentry.captureException(error);
      console.error('Error handling keyboard shortcut:', error);
    }
  }, [
    isActive, 
    isDrawing, 
    cancelDrawing, 
    toggleGridSnapping, 
    toggleAngles,
    toggleStraightening
  ]);
  
  // Set up and clean up keyboard event listeners
  useEffect(() => {
    if (isActive) {
      window.addEventListener('keydown', handleKeyDown);
      
      // Log to Sentry that shortcuts are active
      Sentry.addBreadcrumb({
        category: 'component-lifecycle',
        message: `Line drawing keyboard shortcuts activated for tool: ${tool}`,
        level: 'info'
      });
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        
        // Log to Sentry that shortcuts are deactivated
        Sentry.addBreadcrumb({
          category: 'component-lifecycle',
          message: `Line drawing keyboard shortcuts deactivated for tool: ${tool}`,
          level: 'info'
        });
      };
    }
  }, [isActive, handleKeyDown, tool]);
  
  return {
    handleKeyDown
  };
};
