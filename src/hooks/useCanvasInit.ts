
/**
 * Canvas initialization hook
 * Handles the initialization of the Fabric.js canvas
 * @module useCanvasInit
 */
import { useEffect, useContext } from 'react';
import { useCanvasController } from '@/components/canvas/controller/CanvasController';

interface UseCanvasInitProps {
  onError?: () => void;
}

/**
 * Hook for initializing the canvas with proper error handling
 * @param {UseCanvasInitProps} props - Hook properties
 */
export const useCanvasInit = ({ onError }: UseCanvasInitProps) => {
  // Get canvas controller context
  const canvasController = useCanvasController();

  // Handle any initialization errors
  useEffect(() => {
    const handleInitError = (error: Error) => {
      console.error("Canvas initialization error:", error);
      if (onError) {
        onError();
      }
    };

    // Set up error handler
    window.addEventListener('canvas-init-error', (e: any) => {
      handleInitError(e.detail || new Error('Unknown canvas error'));
    });

    return () => {
      window.removeEventListener('canvas-init-error', (e: any) => {
        handleInitError(e.detail || new Error('Unknown canvas error'));
      });
    };
  }, [onError]);

  return null;
};
