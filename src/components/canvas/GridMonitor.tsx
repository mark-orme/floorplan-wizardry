
/**
 * GridMonitor Component
 * Background component that monitors and repairs grid when needed
 * @module components/canvas/GridMonitor
 */
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createReliableGrid, ensureGridVisibility } from "@/utils/grid/simpleGridCreator";
import { toast } from "sonner";
import logger from "@/utils/logger";

interface GridMonitorProps {
  /** Reference to the canvas object */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Whether monitor is active */
  active?: boolean;
  /** Check interval in ms */
  checkInterval?: number;
}

/**
 * GridMonitor component
 * Monitors and repairs grid in background
 */
export const GridMonitor: React.FC<GridMonitorProps> = ({
  fabricCanvasRef,
  gridLayerRef,
  active = true,
  checkInterval = 5000
}) => {
  const lastCheckRef = useRef(0);
  const checkCountRef = useRef(0);
  const repairCountRef = useRef(0);
  
  // Monitor grid and repair if needed
  useEffect(() => {
    if (!active) return;
    
    const checkAndRepairGrid = () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      const now = Date.now();
      lastCheckRef.current = now;
      checkCountRef.current += 1;
      
      // Log checks every 5th check in development
      if (process.env.NODE_ENV === 'development' && checkCountRef.current % 5 === 0) {
        console.log(`GridMonitor: Check #${checkCountRef.current}, ${gridLayerRef.current.length} grid objects`);
      }
      
      // Check if grid needs repair (missing or no grid)
      const needsRepair = gridLayerRef.current.length === 0 || 
        gridLayerRef.current.some(obj => !canvas.contains(obj));
      
      // If missing objects, try to restore visibility first
      if (needsRepair && gridLayerRef.current.length > 0) {
        const fixed = ensureGridVisibility(canvas, gridLayerRef);
        
        if (fixed) {
          repairCountRef.current += 1;
          logger.info(`GridMonitor: Repaired grid visibility (repair #${repairCountRef.current})`);
          return;
        }
      }
      
      // If no grid at all, create it
      if (gridLayerRef.current.length === 0) {
        logger.warn("GridMonitor: No grid found, creating a new one");
        
        // Create new grid
        const gridObjects = createReliableGrid(canvas, gridLayerRef);
        
        if (gridObjects.length > 0) {
          repairCountRef.current += 1;
          logger.info(`GridMonitor: Created new grid with ${gridObjects.length} objects (repair #${repairCountRef.current})`);
          toast.success("Grid repaired automatically");
        }
      }
    };
    
    // Initial check
    const initialTimeout = setTimeout(checkAndRepairGrid, 1000);
    
    // Regular check interval
    const intervalId = setInterval(checkAndRepairGrid, checkInterval);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [active, checkInterval, fabricCanvasRef, gridLayerRef]);
  
  // This is a non-visual component
  return null;
};
