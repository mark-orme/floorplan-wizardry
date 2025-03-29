
/**
 * Reliable grid initialization hook
 * @module useReliableGridInitialization
 */
import { useRef, useEffect, useMemo } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { toast } from 'sonner';
import { validateGrid } from '@/utils/grid/gridCreationUtils';
import logger from '@/utils/logger';

interface UseReliableGridInitializationProps {
  canvas: FabricCanvas | null;
  createGridFn: (canvas: FabricCanvas) => FabricObject[];
  minInterval?: number;
  maxAttempts?: number;
}

/**
 * Hook for reliable grid initialization with retries and error handling
 */
export function useReliableGridInitialization({
  canvas,
  createGridFn,
  minInterval = 1000,
  maxAttempts = 3
}: UseReliableGridInitializationProps) {
  const gridLayerRef = useRef<FabricObject[]>([]);
  const attemptCountRef = useRef(0);
  const lastAttemptTimeRef = useRef(0);
  const gridCreatedRef = useRef(false);
  
  // Track initialization status
  const initializationStatus = useRef({
    inProgress: false,
    hasError: false,
    errorMessage: '',
    lastError: null as Error | null
  });
  
  /**
   * Check if we can attempt grid creation based on throttling rules
   */
  const canAttemptCreation = () => {
    const now = Date.now();
    return (
      !initializationStatus.current.inProgress && 
      now - lastAttemptTimeRef.current >= minInterval
    );
  };
  
  /**
   * Create grid with error handling and retries
   */
  const createGridWithRetry = useMemo(() => {
    return () => {
      if (!canvas) {
        logger.warn('Cannot create grid: Canvas is null');
        return;
      }
      
      if (!canAttemptCreation()) {
        logger.debug('Grid creation throttled or in progress');
        return;
      }
      
      // Check attempt count
      if (attemptCountRef.current >= maxAttempts) {
        if (!gridCreatedRef.current) {
          toast.error('Failed to create grid after multiple attempts');
        }
        return;
      }
      
      // Update tracking state
      initializationStatus.current.inProgress = true;
      lastAttemptTimeRef.current = Date.now();
      attemptCountRef.current += 1;
      
      try {
        logger.info(`Grid creation attempt ${attemptCountRef.current}`);
        console.log(`Creating grid, attempt ${attemptCountRef.current}`, {
          canvasWidth: canvas.width,
          canvasHeight: canvas.height
        });
        
        // Create grid
        const gridObjects = createGridFn(canvas);
        
        // Store grid objects in ref
        gridLayerRef.current = gridObjects;
        
        // Check if grid was created successfully
        if (gridObjects && gridObjects.length > 0) {
          console.log(`Grid created successfully with ${gridObjects.length} objects`);
          gridCreatedRef.current = true;
          
          // Reset error state
          initializationStatus.current.hasError = false;
          initializationStatus.current.errorMessage = '';
          
          // Schedule a validation check after a short delay
          setTimeout(() => {
            if (canvas && gridLayerRef.current) {
              // Fix: Only pass the canvas and use gridLayerRef.current internally
              const isValid = validateGrid(canvas, { current: gridLayerRef.current });
              
              if (!isValid) {
                logger.warn('Grid validation failed after creation');
                // Try recreating
                if (attemptCountRef.current < maxAttempts) {
                  createGridWithRetry();
                }
              }
            }
          }, 500);
        } else {
          logger.warn('Grid creation returned no objects');
          
          // Retry
          if (attemptCountRef.current < maxAttempts) {
            setTimeout(createGridWithRetry, minInterval);
          }
        }
      } catch (error) {
        const err = error as Error;
        logger.error('Error creating grid:', err);
        console.error('Error creating grid:', err);
        
        // Update error state
        initializationStatus.current.hasError = true;
        initializationStatus.current.errorMessage = err.message;
        initializationStatus.current.lastError = err;
        
        // Retry
        if (attemptCountRef.current < maxAttempts) {
          setTimeout(createGridWithRetry, minInterval);
        } else {
          toast.error('Grid creation failed with an error');
        }
      } finally {
        initializationStatus.current.inProgress = false;
      }
    };
  }, [canvas, createGridFn, minInterval, maxAttempts]);
  
  // Attempt to create grid on canvas change
  useEffect(() => {
    if (canvas) {
      // Reset state for new canvas
      attemptCountRef.current = 0;
      gridCreatedRef.current = false;
      
      // Create grid after a short delay to ensure canvas is ready
      const timeoutId = setTimeout(() => {
        createGridWithRetry();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [canvas, createGridWithRetry]);
  
  return {
    gridLayerRef,
    gridCreated: gridCreatedRef.current,
    createGrid: createGridWithRetry,
    initializationStatus: initializationStatus.current
  };
}
