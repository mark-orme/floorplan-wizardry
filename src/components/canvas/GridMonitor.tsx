/**
 * Grid Monitor Component
 * Provides a way to monitor and debug grid state
 * @module components/canvas/GridMonitor
 */
import React, { useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Grid, RefreshCw, Eye, EyeOff } from "@/components/ui/icons";
import logger from "@/utils/logger";

/**
 * Props for the GridMonitor component
 */
interface GridMonitorProps {
  /** Reference to the fabric canvas */
  canvas: FabricCanvas | null;
  /** Reference to grid objects */
  gridObjects: FabricObject[];
  /** Function to create grid */
  createGrid: () => void;
  /** Whether to show the monitor */
  visible?: boolean;
}

/**
 * GridMonitor Component
 * Monitors and debugs the grid state
 */
export const GridMonitor: React.FC<GridMonitorProps> = ({
  canvas,
  gridObjects,
  createGrid,
  visible = true
}) => {
  const [gridCount, setGridCount] = useState(0);
  const [canvasObjectCount, setCanvasObjectCount] = useState(0);
  const [refreshCount, setRefreshCount] = useState(0);
  
  // Update counts
  useEffect(() => {
    if (!canvas) return;
    
    const updateCounts = () => {
      try {
        setGridCount(gridObjects.length);
        setCanvasObjectCount(canvas.getObjects().length);
      } catch (error) {
        logger.error("Error updating grid monitor counts:", error);
      }
    };
    
    // Update counts immediately
    updateCounts();
    
    // Set up interval to update counts
    const interval = setInterval(updateCounts, 2000);
    
    return () => clearInterval(interval);
  }, [canvas, gridObjects]);
  
  if (!visible || !canvas) {
    return null;
  }
  
  // Check grid state
  const checkGridState = () => {
    if (!canvas) return;
    
    try {
      // Check which grid objects are on canvas
      const canvasObjects = canvas.getObjects();
      const onCanvas = gridObjects.filter(obj => canvasObjects.includes(obj));
      
      // Log results
      logger.info("Grid monitor check:", {
        gridObjectCount: gridObjects.length,
        canvasObjectCount: canvasObjects.length,
        gridObjectsOnCanvas: onCanvas.length,
        missing: gridObjects.length - onCanvas.length
      });
      
      // Ensure grid objects are on canvas
      let fixesApplied = false;
      
      gridObjects.forEach(obj => {
        if (!canvasObjects.includes(obj)) {
          canvas.add(obj);
          canvas.sendToBack(obj);
          fixesApplied = true;
        }
      });
      
      if (fixesApplied) {
        canvas.requestRenderAll();
        logger.info("Grid fixes applied");
      }
      
      setRefreshCount(prev => prev + 1);
    } catch (error) {
      logger.error("Error checking grid state:", error);
    }
  };
  
  return (
    <div className="absolute top-2 right-2 bg-white/90 p-2 rounded shadow-md z-10 text-xs">
      <h3 className="font-bold mb-1">Grid Monitor</h3>
      <div>Grid objects: {gridCount}</div>
      <div>Canvas objects: {canvasObjectCount}</div>
      <div>Refreshes: {refreshCount}</div>
      
      <div className="flex gap-1 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs"
          onClick={checkGridState}
        >
          Check
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs"
          onClick={createGrid}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Recreate
        </Button>
      </div>
    </div>
  );
};
