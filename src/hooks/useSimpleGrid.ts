
/**
 * A simplified hook for grid creation
 * @module hooks/useSimpleGrid
 */
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGrid } from '@/utils/grid/gridRenderers';
import { ensureGridVisibility, forceGridCreationAndVisibility } from '@/utils/grid/gridVisibility';
import { toast } from 'sonner';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

interface UseSimpleGridOptions {
  /** Skip automatic creation if true */
  skipAutoCreation?: boolean;
  /** Show creation toast messages if true */
  showToasts?: boolean;
  /** Check grid visibility interval (ms) */
  checkInterval?: number;
}

/**
 * Simplified hook for reliable grid creation
 * 
 * @param canvas The fabric canvas instance
 * @param options Configuration options
 * @returns Grid control and state objects
 */
export const useSimpleGrid = (
  canvas: FabricCanvas | null,
  options: UseSimpleGridOptions = {}
) => {
  const { 
    skipAutoCreation = false, 
    showToasts = false,
    checkInterval = GRID_CONSTANTS.GRID_CHECK_INTERVAL
  } = options;
  
  const gridLayerRef = useRef<FabricObject[]>([]);
  const [gridCreated, setGridCreated] = useState(false);
  const [objectCount, setObjectCount] = useState(0);
  const [creationAttempts, setCreationAttempts] = useState(0);
  const attemptTimerRef = useRef<number | null>(null);
  
  // Create grid synchronously (not using async anymore)
  const createGridOnCanvas = () => {
    if (!canvas) {
      logger.warn('Cannot create grid: No canvas provided');
      return false;
    }
    
    try {
      setCreationAttempts(prev => prev + 1);
      
      // Use synchronous grid creation
      const gridObjects = createGrid(canvas);
      const success = gridObjects.length > 0;
      
      // Store grid objects in ref
      gridLayerRef.current = gridObjects;
      
      setGridCreated(success);
      setObjectCount(gridObjects.length);
      
      if (success && showToasts) {
        toast.success(`Grid created with ${gridObjects.length} objects`);
      }
      
      return success;
    } catch (error) {
      logger.error('Error creating grid:', error);
      
      if (showToasts) {
        toast.error('Failed to create grid');
      }
      
      return false;
    }
  };
  
  // Force grid creation with retries
  const forceGridCreation = () => {
    if (!canvas) return false;
    
    // Maximum retries to prevent infinite loops
    const maxRetries = GRID_CONSTANTS.GRID_RECREATION_ATTEMPTS;
    
    const attemptCreateGrid = (attempt: number) => {
      if (attempt > maxRetries) {
        logger.error(`Failed to create grid after ${maxRetries} attempts`);
        return;
      }
      
      logger.info(`Attempting grid creation (attempt ${attempt}/${maxRetries})`);
      
      const success = forceGridCreationAndVisibility(canvas);
      
      if (success) {
        // Update grid state
        const gridObjects = canvas.getObjects().filter(obj => 
          (obj as any).objectType === 'grid' || (obj as any).isGrid === true
        );
        
        gridLayerRef.current = gridObjects;
        setGridCreated(true);
        setObjectCount(gridObjects.length);
        
        if (showToasts) {
          toast.success(`Grid recreated with ${gridObjects.length} objects on attempt ${attempt}`);
        }
      } else if (attempt < maxRetries) {
        // Try again after delay
        const delay = GRID_CONSTANTS.GRID_RECREATION_DELAY;
        attemptTimerRef.current = window.setTimeout(() => {
          attemptCreateGrid(attempt + 1);
        }, delay);
      }
    };
    
    // Start first attempt
    attemptCreateGrid(1);
    return true;
  };
  
  // Clear grid
  const clearGrid = () => {
    if (!canvas) return false;
    
    try {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      gridLayerRef.current = [];
      setGridCreated(false);
      setObjectCount(0);
      
      canvas.requestRenderAll();
      
      if (showToasts) {
        toast.info('Grid cleared');
      }
      
      return true;
    } catch (error) {
      logger.error('Error clearing grid:', error);
      return false;
    }
  };
  
  // Check if grid is in good state
  const checkGridHealth = () => {
    if (!canvas || !gridCreated) return;
    
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    // Check if grid count looks correct
    if (gridObjects.length < GRID_CONSTANTS.MIN_GRID_OBJECTS) {
      logger.warn(`Grid appears to be missing, only ${gridObjects.length} grid objects found`);
      
      if (GRID_CONSTANTS.AUTO_RECREATE_ON_EMPTY) {
        forceGridCreation();
      }
      
      return false;
    }
    
    // Check if any grid objects are invisible
    const invisibleObjects = gridObjects.filter(obj => !obj.visible);
    if (invisibleObjects.length > 0) {
      logger.warn(`Found ${invisibleObjects.length} invisible grid objects, fixing visibility`);
      
      invisibleObjects.forEach(obj => obj.set('visible', true));
      canvas.requestRenderAll();
      
      return true;
    }
    
    return true;
  };
  
  // Automatically create grid when canvas becomes available
  useEffect(() => {
    if (canvas && !skipAutoCreation && !gridCreated) {
      // Short delay to ensure canvas is fully initialized
      const timeoutId = setTimeout(() => {
        createGridOnCanvas();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [canvas, skipAutoCreation, gridCreated]);
  
  // Periodically ensure grid is visible and healthy
  useEffect(() => {
    if (!canvas || !gridCreated) return;
    
    const intervalId = setInterval(() => {
      // Use ensureGridVisibility function
      const fixesApplied = ensureGridVisibility(canvas);
      
      if (fixesApplied) {
        setObjectCount(gridLayerRef.current.length);
      }
      
      // Also run our more thorough grid health check
      checkGridHealth();
    }, checkInterval);
    
    return () => clearInterval(intervalId);
  }, [canvas, gridCreated, checkInterval]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (canvas && gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
      }
      
      // Clear any pending timers
      if (attemptTimerRef.current) {
        clearTimeout(attemptTimerRef.current);
      }
    };
  }, [canvas]);
  
  return {
    gridCreated,
    objectCount,
    creationAttempts,
    createGrid: createGridOnCanvas, // Use our fixed function here
    clearGrid,
    forceGridCreation,
    gridLayerRef
  };
};
