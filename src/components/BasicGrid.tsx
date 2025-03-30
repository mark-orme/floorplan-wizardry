
import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { forceCreateGrid } from "@/utils/grid/gridDebugUtils";

interface BasicGridProps {
  fabricCanvas: FabricCanvas | null;
  onGridCreated?: (gridObjects: FabricObject[]) => void;
  debugMode?: boolean;
}

export const BasicGrid: React.FC<BasicGridProps> = ({ 
  fabricCanvas,
  onGridCreated,
  debugMode = false
}) => {
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const initializationAttemptRef = useRef<number>(0);
  const checkIntervalRef = useRef<number | null>(null);
  const [lastAttemptTime, setLastAttemptTime] = useState<number>(0);
  const maxAttempts = 5;
  const throttleTime = 2000; // 2 seconds between attempts
  
  // Log debug info if debugMode is enabled
  const debugLog = (message: string, ...args: any[]) => {
    if (debugMode) {
      console.log(`[BasicGrid] ${message}`, ...args);
    }
  };
  
  // Create simple grid on the canvas
  const createSimpleGrid = (canvas: FabricCanvas): FabricObject[] => {
    if (!canvas || !canvas.width || !canvas.height) {
      debugLog("Cannot create grid: Invalid canvas dimensions");
      return [];
    }
    
    try {
      // Clean any existing grid objects
      const existingGrid = canvas.getObjects().filter(obj => 
        obj.objectType === 'grid' || obj.objectType === 'grid-debug'
      );
      existingGrid.forEach(obj => canvas.remove(obj));
      
      // Create new grid - use direct implementation for reliability
      const gridObjects: FabricObject[] = [];
      
      // Use constants for grid spacing
      const smallGridSize = GRID_CONSTANTS.SMALL_GRID_SIZE;
      const largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE;
      
      // Calculate grid dimensions to cover the entire canvas with margin
      const width = canvas.width;
      const height = canvas.height;
      
      // Create vertical grid lines - both small and large
      for (let x = 0; x <= width; x += smallGridSize) {
        // Create vertical line
        const isLargeLine = x % largeGridSize === 0;
        const line = new fabric.Line([x, 0, x, height], {
          stroke: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR,
          strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_WIDTH : GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          excludeFromExport: true,
          hoverCursor: 'default'
        });
        
        canvas.add(line);
        gridObjects.push(line);
      }
      
      // Create horizontal grid lines - both small and large
      for (let y = 0; y <= height; y += smallGridSize) {
        // Create horizontal line
        const isLargeLine = y % largeGridSize === 0;
        const line = new fabric.Line([0, y, width, y], {
          stroke: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR,
          strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE_GRID_WIDTH : GRID_CONSTANTS.SMALL_GRID_WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          excludeFromExport: true,
          hoverCursor: 'default'
        });
        
        canvas.add(line);
        gridObjects.push(line);
      }
      
      // Send all grid objects to back
      gridObjects.forEach(obj => {
        canvas.sendToBack(obj);
      });
      
      // Force render
      canvas.requestRenderAll();
      
      return gridObjects;
    } catch (error) {
      console.error("Error creating simple grid:", error);
      // Fallback to debug grid if regular fails
      return forceCreateGrid(canvas);
    }
  };
  
  // Ensure grid is visible on canvas
  const ensureGridVisible = (canvas: FabricCanvas, gridObjects: FabricObject[]): boolean => {
    if (!canvas || gridObjects.length === 0) return false;
    
    let fixed = false;
    
    // Check for missing grid objects and add them back
    gridObjects.forEach(obj => {
      if (!canvas.contains(obj)) {
        canvas.add(obj);
        fixed = true;
      }
    });
    
    // Send all grid objects to back
    if (fixed) {
      gridObjects.forEach(obj => {
        canvas.sendToBack(obj);
      });
      canvas.renderAll();
    }
    
    return fixed;
  };
  
  // Force recreation of grid
  const forceGridRecreation = (canvas: FabricCanvas, currentGrid: FabricObject[]): FabricObject[] => {
    // Remove existing grid
    currentGrid.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    // Create new grid
    return createSimpleGrid(canvas);
  };
  
  // Create grid with throttling
  const createGridWithThrottle = () => {
    const now = Date.now();
    
    // Prevent too frequent attempts
    if (now - lastAttemptTime < throttleTime) {
      debugLog(`Grid creation throttled (last attempt: ${now - lastAttemptTime}ms ago)`);
      return false;
    }
    
    // Track attempt
    initializationAttemptRef.current += 1;
    setLastAttemptTime(now);
    
    // Limit number of attempts
    if (initializationAttemptRef.current > maxAttempts) {
      debugLog(`Max grid creation attempts (${maxAttempts}) reached`);
      return false;
    }
    
    return true;
  };
  
  // Create grid when canvas becomes available
  useEffect(() => {
    if (!fabricCanvas) {
      debugLog("Canvas not available, waiting...");
      return;
    }
    
    debugLog("Canvas available, checking dimensions:", {
      width: fabricCanvas.width, 
      height: fabricCanvas.height,
      domWidth: fabricCanvas.wrapperEl?.clientWidth,
      domHeight: fabricCanvas.wrapperEl?.clientHeight
    });
    
    // Clear any existing check interval
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    
    // Function to create the grid
    const createGridOnCanvas = () => {
      if (!fabricCanvas) return false;
      
      // Check if we should throttle
      if (!createGridWithThrottle()) {
        return false;
      }
      
      try {
        debugLog(`Attempting to create grid (attempt ${initializationAttemptRef.current})`);
        
        // Fix canvas dimensions if needed
        const containerWidth = fabricCanvas.wrapperEl?.clientWidth;
        const containerHeight = fabricCanvas.wrapperEl?.clientHeight;
        
        if (containerWidth && containerHeight && 
            (fabricCanvas.width !== containerWidth || fabricCanvas.height !== containerHeight)) {
          debugLog(`Updating canvas dimensions to match container: ${containerWidth}x${containerHeight}`);
          fabricCanvas.setWidth(containerWidth);
          fabricCanvas.setHeight(containerHeight);
        }
        
        // Get current dimensions
        const width = fabricCanvas.width;
        const height = fabricCanvas.height;
        debugLog(`Canvas dimensions: ${width}x${height}`);
        
        if (!width || !height || width < 10 || height < 10) {
          console.error("Canvas has invalid dimensions, delaying grid creation");
          return false; // Failed to create grid
        }
        
        // Create the grid
        const objects = createSimpleGrid(fabricCanvas);
        gridObjectsRef.current = objects;
        
        if (objects.length > 0) {
          debugLog(`Grid created with ${objects.length} objects`);
          
          // Callback if grid was created successfully
          if (onGridCreated) {
            onGridCreated(objects);
          }
          
          // Delay to ensure proper rendering
          setTimeout(() => {
            fabricCanvas.requestRenderAll();
            debugLog("Forced canvas re-render after grid creation");
          }, 100);
          
          toast.success("Grid created successfully");
          return true; // Grid created successfully
        } else {
          console.error("Grid creation returned 0 objects");
          toast.error("Failed to create grid");
          return false; // Failed to create grid
        }
      } catch (error) {
        console.error("Error creating grid in BasicGrid component:", error);
        toast.error("Error creating grid");
        return false; // Failed to create grid
      }
    };
    
    // Try to create grid initially with a short delay
    const initialTimeout = setTimeout(() => {
      const success = createGridOnCanvas();
      
      // If initial creation failed, set up periodic checks
      if (!success && initializationAttemptRef.current < maxAttempts) {
        checkIntervalRef.current = window.setInterval(() => {
          const success = createGridOnCanvas();
          
          // Stop trying after success or too many attempts
          if (success || initializationAttemptRef.current >= maxAttempts) {
            if (checkIntervalRef.current) {
              clearInterval(checkIntervalRef.current);
              checkIntervalRef.current = null;
            }
          }
        }, 1000);
      }
    }, 500); // Longer initial delay to ensure canvas is ready
    
    // Periodic check to ensure grid is visible
    const visibilityInterval = setInterval(() => {
      if (fabricCanvas && gridObjectsRef.current.length > 0) {
        const fixed = ensureGridVisible(fabricCanvas, gridObjectsRef.current);
        if (fixed) {
          debugLog("Fixed grid visibility");
        }
      }
    }, 3000);
    
    // Fallback force recreation if no grid after 5 seconds
    const fallbackTimeout = setTimeout(() => {
      if (fabricCanvas && gridObjectsRef.current.length === 0) {
        debugLog("No grid after 5 seconds, forcing recreation");
        const objects = forceGridRecreation(fabricCanvas, gridObjectsRef.current);
        gridObjectsRef.current = objects;
        
        if (objects.length > 0 && onGridCreated) {
          onGridCreated(objects);
        }
      }
    }, 5000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(fallbackTimeout);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      clearInterval(visibilityInterval);
    };
  }, [fabricCanvas, onGridCreated, debugMode]);

  // This is a non-visual component that manages grid
  return null;
};
