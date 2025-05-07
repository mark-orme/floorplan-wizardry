
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface UseGeometryEngineProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  enabled?: boolean;
}

/**
 * Hook to provide geometry calculation capabilities for the canvas
 * Uses Web Workers for improved performance
 */
export const useGeometryEngine = ({ fabricCanvasRef, enabled = true }: UseGeometryEngineProps) => {
  const workerRef = useRef<Worker | null>(null);
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled || isInitialized.current) return;

    try {
      // Create worker
      workerRef.current = new Worker('/workers/geometryEngine.js');
      
      // Set up message handler
      workerRef.current.onmessage = (e) => {
        const { result, error, operation } = e.data;
        
        if (error) {
          console.error(`Geometry engine error (${operation}):`, error);
          return;
        }
        
        if (operation === 'calculateArea' && fabricCanvasRef.current) {
          // Implementation for updating the canvas with calculated area
          // This would depend on your application logic
        }
      };
      
      // Initialize the worker
      const bounds = fabricCanvasRef.current?.getWidth && fabricCanvasRef.current?.getHeight ? {
        width: fabricCanvasRef.current.getWidth() || 800,
        height: fabricCanvasRef.current.getHeight() || 600,
        left: 0,
        top: 0,
        right: fabricCanvasRef.current.getWidth() || 800,
        bottom: fabricCanvasRef.current.getHeight() || 600
      } : { width: 800, height: 600, left: 0, top: 0, right: 800, bottom: 600 };
      
      workerRef.current.postMessage({
        operation: 'initialize',
        bounds
      });
      
      isInitialized.current = true;
    } catch (error) {
      console.error('Failed to initialize geometry engine:', error);
      toast.error('Failed to initialize geometry calculations');
    }
    
    // Clean up
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      isInitialized.current = false;
    };
  }, [fabricCanvasRef, enabled]);

  return {
    isInitialized: isInitialized.current,
  };
};
