
/**
 * Canvas initialization hook
 * Handles additional canvas initialization logic
 * @module useCanvasInit
 */
import { useEffect } from 'react';
import { toast } from 'sonner';

interface UseCanvasInitProps {
  onError?: () => void;
}

/**
 * Hook for canvas initialization
 * Performs additional setup and error handling
 * 
 * @param {UseCanvasInitProps} props - Hook properties
 * @returns {void}
 */
export const useCanvasInit = ({ onError }: UseCanvasInitProps): void => {
  // Listen for canvas initialization errors
  useEffect(() => {
    const handleCanvasInitError = (event: CustomEvent) => {
      console.error("Canvas initialization error:", event.detail);
      
      if (onError) {
        onError();
      }
    };
    
    // Add event listener
    window.addEventListener('canvas-init-error', handleCanvasInitError as EventListener);
    
    console.log("Canvas initialization hook attached");
    
    // Cleanup function
    return () => {
      window.removeEventListener('canvas-init-error', handleCanvasInitError as EventListener);
    };
  }, [onError]);
  
  return;
};
