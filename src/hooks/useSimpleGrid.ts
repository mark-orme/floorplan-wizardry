
/**
 * A simplified hook for grid creation
 * @module hooks/useSimpleGrid
 */
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGrid } from '@/utils/grid/gridRenderers';
import { ensureGridVisibility } from '@/utils/grid/gridVisibility';
import { toast } from 'sonner';

interface UseSimpleGridOptions {
  /** Skip automatic creation if true */
  skipAutoCreation?: boolean;
  /** Show creation toast messages if true */
  showToasts?: boolean;
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
  const { skipAutoCreation = false, showToasts = false } = options;
  
  const gridLayerRef = useRef<FabricObject[]>([]);
  const [gridCreated, setGridCreated] = useState(false);
  const [objectCount, setObjectCount] = useState(0);
  const [creationAttempts, setCreationAttempts] = useState(0);
  
  // Create grid synchronously (not using async anymore)
  const createGrid = () => {
    if (!canvas) {
      console.warn('Cannot create grid: No canvas provided');
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
      console.error('Error creating grid:', error);
      
      if (showToasts) {
        toast.error('Failed to create grid');
      }
      
      return false;
    }
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
      console.error('Error clearing grid:', error);
      return false;
    }
  };
  
  // Automatically create grid when canvas becomes available
  useEffect(() => {
    if (canvas && !skipAutoCreation && !gridCreated) {
      // Short delay to ensure canvas is fully initialized
      const timeoutId = setTimeout(() => {
        createGrid();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [canvas, skipAutoCreation, gridCreated]);
  
  // Periodically ensure grid is visible
  useEffect(() => {
    if (!canvas || !gridCreated) return;
    
    const intervalId = setInterval(() => {
      // Pass the actual grid objects, not the ref itself
      const fixesApplied = ensureGridVisibility(canvas, gridLayerRef.current);
      
      if (fixesApplied) {
        setObjectCount(gridLayerRef.current.length);
      }
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [canvas, gridCreated]);
  
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
    };
  }, [canvas]);
  
  return {
    gridCreated,
    objectCount,
    creationAttempts,
    createGrid,
    clearGrid,
    gridLayerRef
  };
};
