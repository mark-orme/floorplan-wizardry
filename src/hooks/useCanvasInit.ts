
/**
 * Canvas initialization hook
 * Handles the initialization of the Fabric.js canvas
 * @module useCanvasInit
 */
import { useEffect } from 'react';
import { useCanvasController } from '@/components/canvas/controller/CanvasController';
import { toast } from 'sonner';

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
      
      // Show error toast
      toast.error("Canvas initialization failed. Please try refreshing the page.");
      
      if (onError) {
        onError();
      }
    };

    // Set up error handler for canvas initialization errors
    const listener = (e: any) => {
      handleInitError(e.detail || new Error('Unknown canvas error'));
    };
    
    window.addEventListener('canvas-init-error', listener);

    return () => {
      window.removeEventListener('canvas-init-error', listener);
    };
  }, [onError]);

  return null;
};
