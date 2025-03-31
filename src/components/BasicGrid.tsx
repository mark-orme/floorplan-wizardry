import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

/**
 * Props for the BasicGrid component
 * @interface BasicGridProps
 */
interface BasicGridProps {
  /** The Fabric.js canvas instance to render the grid on */
  canvas: FabricCanvas;
  /** Whether the grid should be visible */
  visible?: boolean;
  /** Callback function triggered when the grid is successfully created */
  onGridCreated?: (gridObjects: FabricObject[]) => void;
}

/**
 * BasicGrid component
 * Renders a customizable grid on a Fabric.js canvas
 * 
 * @component
 * @param {BasicGridProps} props - Component properties
 * @returns {null} This is a UI-less component that manipulates the canvas directly
 */
export const BasicGrid: React.FC<BasicGridProps> = ({
  canvas,
  visible = true,
  onGridCreated
}) => {
  // Reference to track grid objects for manipulation and cleanup
  const gridObjectsRef = useRef<FabricObject[]>([]);
  // State to track whether grid has been created
  const [isGridCreated, setIsGridCreated] = useState(false);
  // Reference to track whether grid creation has been attempted
  const gridCreationAttemptedRef = useRef(false);
  // Reference to track timeout for retry mechanism
  const gridCreationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * Creates grid with retry mechanism if canvas dimensions are not ready
   * Implements exponential backoff for retries
   * 
   * @param {number} retryCount - Current retry attempt number
   * @param {number} maxRetries - Maximum number of retry attempts
   * @returns {FabricObject[] | undefined} Array of created grid objects or undefined on failure
   */
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
