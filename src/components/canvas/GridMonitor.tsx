
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createReliableGrid, ensureGridVisibility } from "@/utils/grid/simpleGridCreator";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import logger from "@/utils/logger";

interface GridMonitorProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  active?: boolean;
}

export const GridMonitor: React.FC<GridMonitorProps> = ({
  fabricCanvasRef,
  gridLayerRef,
  active = true
}) => {
  const intervalRef = useRef<number | null>(null);
  const checkAttemptsRef = useRef<number>(0);
  
  // Function to check and repair grid if necessary
  const checkAndRepairGrid = () => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas) return;
    
    try {
      // If grid is empty or has very few objects, recreate it
      if (gridLayerRef.current.length < 10) {
        logger.info(`GridMonitor: Grid has only ${gridLayerRef.current.length} objects, recreating...`);
        const newGrid = createReliableGrid(canvas, gridLayerRef);
        logger.info(`GridMonitor: Recreated grid with ${newGrid.length} objects`);
        checkAttemptsRef.current = 0;
        return;
      }
      
      // Check if all grid elements are visible on canvas
      const hasFixedVisibility = ensureGridVisibility(canvas, gridLayerRef);
      
      if (hasFixedVisibility) {
        logger.info(`GridMonitor: Fixed grid visibility`);
      }
      
      checkAttemptsRef.current = 0;
    } catch (error) {
      logger.error("Error checking grid:", error);
      checkAttemptsRef.current += 1;
      
      // If we've had multiple failures, try a more aggressive fix
      if (checkAttemptsRef.current >= 3) {
        try {
          // Complete grid recreation
          gridLayerRef.current.forEach(obj => {
            if (canvas.contains(obj)) {
              canvas.remove(obj);
            }
          });
          
          gridLayerRef.current = [];
          const newGrid = createReliableGrid(canvas, gridLayerRef);
          logger.info(`GridMonitor: Force recreated grid with ${newGrid.length} objects after ${checkAttemptsRef.current} failed attempts`);
          
          checkAttemptsRef.current = 0;
        } catch (recreateError) {
          logger.error("Failed to recreate grid:", recreateError);
        }
      }
    }
  };
  
  // Set up periodic grid monitoring
  useEffect(() => {
    if (!active) return;
    
    // Initial check with delay to ensure canvas is ready
    const initialTimer = setTimeout(() => {
      checkAndRepairGrid();
    }, 500);
    
    // Regular interval checks
    intervalRef.current = window.setInterval(() => {
      checkAndRepairGrid();
    }, GRID_CONSTANTS.VISIBILITY_CHECK_INTERVAL);
    
    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [active, fabricCanvasRef.current]);
  
  // This is a non-visual component
  return null;
};
