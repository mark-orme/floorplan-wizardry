
import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

interface BasicGridProps {
  canvas: FabricCanvas;
  visible?: boolean;
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

export const BasicGrid: React.FC<BasicGridProps> = ({
  canvas,
  visible = true,
  onGridCreated
}) => {
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const [isGridCreated, setIsGridCreated] = useState(false);
  const gridCreationAttemptedRef = useRef(false);
  const gridCreationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to handle grid creation errors and retry
  const createGridWithRetry = useCallback((retryCount = 0, maxRetries = 3) => {
    // Clear any existing timeout
    if (gridCreationTimeoutRef.current) {
      clearTimeout(gridCreationTimeoutRef.current);
      gridCreationTimeoutRef.current = null;
    }
    
    // Check if canvas is ready for grid creation
    if (!canvas || !canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
      if (retryCount < maxRetries) {
        logger.warn(`Canvas dimensions not set, retrying grid creation (attempt ${retryCount + 1}/${maxRetries})`);
        // Retry after delay with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        gridCreationTimeoutRef.current = setTimeout(() => {
          createGridWithRetry(retryCount + 1, maxRetries);
        }, delay);
      } else {
        logger.error('Failed to create grid: Canvas dimensions not available after maximum retries');
      }
      return;
    }
    
    try {
      logger.info("Creating basic grid with dimensions:", canvas.width, "x", canvas.height);
      console.log("Creating basic grid with dimensions:", canvas.width, "x", canvas.height);
      
      // Create grid objects
      const gridObjects: FabricObject[] = [];
      const width = canvas.width;
      const height = canvas.height;
      
      // Create horizontal grid lines (small grid)
      for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
        const line = new Line([0, i, width, i], {
          stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid'
        } as any);
        
        canvas.add(line);
        gridObjects.push(line);
      }
      
      // Create vertical grid lines (small grid)
      for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
        const line = new Line([i, 0, i, height], {
          stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid'
        } as any);
        
        canvas.add(line);
        gridObjects.push(line);
      }
      
      // Create horizontal grid lines (large grid)
      for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
        const line = new Line([0, i, width, i], {
          stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid'
        } as any);
        
        canvas.add(line);
        gridObjects.push(line);
      }
      
      // Create vertical grid lines (large grid)
      for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
        const line = new Line([i, 0, i, height], {
          stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
          strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid'
        } as any);
        
        canvas.add(line);
        gridObjects.push(line);
      }
      
      // Store grid objects
      gridObjectsRef.current = gridObjects;
      
      // Update visibility
      updateGridVisibility(visible);
      
      // Mark grid as created
      setIsGridCreated(true);
      
      // Render the canvas to show the grid
      canvas.renderAll();
      
      // Notify parent component
      if (onGridCreated) {
        onGridCreated(gridObjects);
      }
      
      logger.info(`Grid created successfully with ${gridObjects.length} objects`);
      console.log(`Grid created successfully with ${gridObjects.length} objects`);
      
      return gridObjects;
    } catch (error) {
      logger.error('Error creating grid:', error);
      console.error('Error creating grid:', error);
      
      if (retryCount < maxRetries) {
        // Retry after delay
        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        gridCreationTimeoutRef.current = setTimeout(() => {
          createGridWithRetry(retryCount + 1, maxRetries);
        }, delay);
      }
      
      return [];
    }
  }, [canvas, visible, onGridCreated]);
  
  // Create grid when component mounts or canvas changes - ONCE
  useEffect(() => {
    if (!canvas) return;
    
    // Prevent multiple creation attempts
    if (gridCreationAttemptedRef.current || isGridCreated) return;
    gridCreationAttemptedRef.current = true;
    
    // Create grid with retry mechanism
    createGridWithRetry();
    
    // Cleanup function
    return () => {
      if (gridCreationTimeoutRef.current) {
        clearTimeout(gridCreationTimeoutRef.current);
      }
    };
  }, [canvas, isGridCreated, createGridWithRetry]);
  
  // Update grid visibility when visible prop changes
  const updateGridVisibility = useCallback((isVisible: boolean) => {
    if (!canvas) return;
    
    const gridObjects = gridObjectsRef.current;
    
    // Update visibility of all grid objects
    gridObjects.forEach(obj => {
      obj.visible = isVisible;
    });
    
    // Render the canvas to reflect visibility changes
    canvas.renderAll();
  }, [canvas]);
  
  // Update grid visibility when visible prop changes
  useEffect(() => {
    updateGridVisibility(visible);
  }, [visible, updateGridVisibility]);
  
  // Cleanup grid objects when component unmounts
  useEffect(() => {
    return () => {
      if (canvas && gridObjectsRef.current.length > 0) {
        gridObjectsRef.current.forEach(obj => {
          canvas.remove(obj);
        });
        canvas.renderAll();
        gridObjectsRef.current = [];
      }
    };
  }, [canvas]);
  
  // This is a UI-less component that manages grid objects
  return null;
};
