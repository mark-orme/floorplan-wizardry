
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { INIT_DELAY, resetInitializationState, resetGridProgress } from '@/utils/canvas/canvasInit';
import { toast } from 'sonner';

// Define the error categories
export type CanvasErrorCategory = 
  | 'dom-missing'
  | 'canvas-creation'
  | 'event-binding'
  | 'initialization'
  | 'grid-creation'
  | 'object-loading'
  | 'general';

export interface UseCanvasInitOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error, category: CanvasErrorCategory) => void;
  maxRetries?: number;
  throttleRender?: boolean;
  preserveObjectStacking?: boolean;
  enableRetinaScaling?: boolean;
}

export interface UseCanvasInitResult {
  canvas: FabricCanvas | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isInitializing: boolean;
  isReady: boolean;
  error: Error | null;
  errorCategory: CanvasErrorCategory | null;
  resetCanvas: () => void;
  retryInitialization: () => void;
  renderAll: () => void;
}

/**
 * Hook for initializing and managing a Fabric.js canvas
 */
export function useCanvasInit(options: UseCanvasInitOptions = {}): UseCanvasInitResult {
  const {
    width = 800,
    height = 600,
    backgroundColor = '#ffffff',
    onReady,
    onError,
    maxRetries = 3,
    throttleRender = true,
    preserveObjectStacking = true,
    enableRetinaScaling = true
  } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [errorCategory, setErrorCategory] = useState<CanvasErrorCategory | null>(null);
  const renderRequestRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);

  // Initialize the canvas with safety checks
  useEffect(() => {
    const initializeCanvas = () => {
      try {
        // Reset initialization state
        resetInitializationState();
        resetGridProgress();
        
        // Check if canvas element exists
        if (!canvasRef.current) {
          throw new Error('Canvas DOM element not found');
        }
        
        setIsInitializing(true);
        
        // Create Fabric canvas
        const fabricCanvas = new FabricCanvas(canvasRef.current, {
          width,
          height,
          backgroundColor,
          preserveObjectStacking,
          enableRetinaScaling
        });
        
        // Configure canvas options
        fabricCanvas.selection = true;
        fabricCanvas.renderOnAddRemove = !throttleRender;
        
        // Apply safety for object stacking
        if (preserveObjectStacking) {
          fabricCanvas.preserveObjectStacking = true;
        }
        
        // Set canvas and update state
        setCanvas(fabricCanvas);
        setIsInitializing(false);
        setIsReady(true);
        setError(null);
        setErrorCategory(null);
        
        // Call onReady callback if provided
        if (onReady) {
          setTimeout(() => {
            onReady(fabricCanvas);
          }, INIT_DELAY);
        }
        
        return () => {
          // Clean up canvas on unmount
          fabricCanvas.dispose();
          if (renderRequestRef.current !== null) {
            cancelAnimationFrame(renderRequestRef.current);
          }
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown canvas initialization error');
        const category: CanvasErrorCategory = !canvasRef.current 
          ? 'dom-missing' 
          : 'canvas-creation';
        
        console.error('Canvas initialization error:', error);
        setIsInitializing(false);
        setIsReady(false);
        setError(error);
        setErrorCategory(category);
        
        // Call onError callback if provided
        if (onError) {
          onError(error, category);
        }
        
        // Show error toast
        toast.error(`Canvas error: ${error.message}`);
        
        return undefined;
      }
    };
    
    const cleanup = initializeCanvas();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [
    width, 
    height, 
    backgroundColor, 
    onReady, 
    onError, 
    throttleRender,
    preserveObjectStacking,
    enableRetinaScaling
  ]);

  // Function to reset the canvas
  const resetCanvas = () => {
    if (!canvas) return;
    
    try {
      // Clear all objects
      canvas.clear();
      
      // Reset canvas properties
      canvas.backgroundColor = backgroundColor;
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      
      // Render the canvas
      canvas.renderAll();
      
      // Reset error state
      setError(null);
      setErrorCategory(null);
      
      // Notify user
      toast.success('Canvas reset successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reset canvas');
      
      console.error('Canvas reset error:', error);
      setError(error);
      setErrorCategory('general');
      
      // Call onError callback if provided
      if (onError) {
        onError(error, 'general');
      }
      
      // Show error toast
      toast.error(`Failed to reset canvas: ${error.message}`);
    }
  };

  // Function to retry initialization
  const retryInitialization = () => {
    if (retryCountRef.current >= maxRetries) {
      toast.error(`Maximum retry attempts (${maxRetries}) reached`);
      return;
    }
    
    retryCountRef.current++;
    
    try {
      // Clean up existing canvas if any
      if (canvas) {
        canvas.dispose();
      }
      
      // Reset state
      setCanvas(null);
      setIsInitializing(true);
      setIsReady(false);
      setError(null);
      setErrorCategory(null);
      
      // Show toast
      toast.info(`Retrying canvas initialization (attempt ${retryCountRef.current}/${maxRetries})`);
      
      // Re-run effect to initialize canvas
      const timer = setTimeout(() => {
        if (canvasRef.current) {
          const fabricCanvas = new FabricCanvas(canvasRef.current, {
            width,
            height,
            backgroundColor,
            preserveObjectStacking,
            enableRetinaScaling
          });
          
          setCanvas(fabricCanvas);
          setIsInitializing(false);
          setIsReady(true);
          
          // Call onReady callback if provided
          if (onReady) {
            onReady(fabricCanvas);
          }
          
          toast.success('Canvas initialized successfully');
        } else {
          setIsInitializing(false);
          setError(new Error('Canvas DOM element not found on retry'));
          setErrorCategory('dom-missing');
          
          toast.error('Canvas element not found on retry');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to retry canvas initialization');
      
      console.error('Canvas retry error:', error);
      setIsInitializing(false);
      setError(error);
      setErrorCategory('initialization');
      
      // Call onError callback if provided
      if (onError) {
        onError(error, 'initialization');
      }
      
      // Show error toast
      toast.error(`Retry failed: ${error.message}`);
    }
  };

  // Function to render all objects
  const renderAll = () => {
    if (!canvas) return;
    
    if (throttleRender) {
      // Use requestAnimationFrame for throttling
      if (renderRequestRef.current !== null) {
        cancelAnimationFrame(renderRequestRef.current);
      }
      
      renderRequestRef.current = requestAnimationFrame(() => {
        canvas.renderAll();
        renderRequestRef.current = null;
      });
    } else {
      // Render immediately
      canvas.renderAll();
    }
  };

  return {
    canvas,
    canvasRef,
    isInitializing,
    isReady,
    error,
    errorCategory,
    resetCanvas,
    retryInitialization,
    renderAll
  };
}
