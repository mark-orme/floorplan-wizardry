
import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import GridRenderer from "./grid/GridRenderer";
import { captureMessage } from "@/utils/sentryUtils";
import logger from "@/utils/logger";
import { ExtendedFabricObject } from "@/types/fabric-extended";

interface GridLayerProps {
  fabricCanvas: Canvas;
  dimensions: { width: number; height: number };
  showDebug?: boolean;
}

export const GridLayer: React.FC<GridLayerProps> = ({
  fabricCanvas,
  dimensions,
  showDebug = false
}) => {
  const [gridObjects, setGridObjects] = useState<ExtendedFabricObject[]>([]);
  // Add ref to track if grid has been initialized
  const gridInitializedRef = useRef(false);
  const dimensionsRef = useRef(dimensions);
  
  // Update dimensions ref when dimensions change
  useEffect(() => {
    dimensionsRef.current = dimensions;
  }, [dimensions]);
  
  // Handle grid creation
  const handleGridCreated = (objects: ExtendedFabricObject[]) => {
    if (!gridInitializedRef.current) {
      logger.info(`Grid created with ${objects.length} objects`);
      setGridObjects(objects);
      gridInitializedRef.current = true;
      
      captureMessage("Grid layer created", {
        level: 'info',
        tags: { component: "GridLayer" },
        extra: { 
          objectCount: objects.length, 
          dimensions: dimensionsRef.current 
        }
      });
    }
  };
  
  // Update grid when dimensions change substantially
  useEffect(() => {
    if (fabricCanvas && gridObjects.length > 0) {
      const width = dimensionsRef.current.width;
      const height = dimensionsRef.current.height;
      
      logger.info("Requesting render for grid with dimensions", { width, height });
      fabricCanvas.requestRenderAll();
    }
  }, [dimensions.width, dimensions.height, fabricCanvas, gridObjects.length]);
  
  // Safeguard to verify grid exists and is visible
  useEffect(() => {
    const checkGridVisibility = () => {
      if (fabricCanvas && gridObjects.length > 0) {
        const visibleGridObjects = gridObjects.filter(obj => 
          obj && obj.visible && fabricCanvas.contains(obj)
        );
        
        if (visibleGridObjects.length < gridObjects.length * 0.5) {
          logger.warn("Grid visibility issue detected, forcing re-render");
          fabricCanvas.requestRenderAll();
        }
      }
    };
    
    // Check grid visibility periodically
    const intervalId = setInterval(checkGridVisibility, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [fabricCanvas, gridObjects]);
  
  if (!fabricCanvas) return null;
  
  return (
    <GridRenderer 
      canvas={fabricCanvas}
      gridSize={50}
      visible={true}
    />
  );
};
