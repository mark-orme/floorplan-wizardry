
import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, fabric } from "fabric";
import { captureMessage } from "@/utils/sentryUtils";
import { ExtendedFabricCanvas } from "@/types/canvas-types";
import logger from "@/utils/logger";

interface GridLayerProps {
  fabricCanvas: FabricCanvas | ExtendedFabricCanvas;
  dimensions: { width: number; height: number };
  showDebug?: boolean;
}

export const GridLayer: React.FC<GridLayerProps> = ({
  fabricCanvas,
  dimensions,
  showDebug = false
}) => {
  const [gridObjects, setGridObjects] = useState<any[]>([]);
  const gridInitializedRef = useRef(false);
  const dimensionsRef = useRef(dimensions);
  
  useEffect(() => {
    dimensionsRef.current = dimensions;
  }, [dimensions]);
  
  const handleGridCreated = (objects: any[]) => {
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
  
  // Create grid on component mount
  useEffect(() => {
    if (!fabricCanvas) return;
    
    try {
      console.log('Creating grid layer...');
      
      // Clear any existing grid
      gridObjects.forEach(obj => {
        fabricCanvas.remove(obj);
      });
      
      // Create new grid with the raw canvas
      const newGridObjects = createGrid(fabricCanvas, dimensions);
      setGridObjects(newGridObjects);
      
      // Clean up when component unmounts
      return () => {
        newGridObjects.forEach(obj => {
          fabricCanvas.remove(obj);
        });
      };
    } catch (error) {
      console.error('Error creating grid:', error);
    }
  }, [fabricCanvas, dimensions.width, dimensions.height]);
  
  // Helper function to create grid
  function createGrid(canvas: FabricCanvas | ExtendedFabricCanvas, dimensions: { width: number; height: number }): any[] {
    const gridObjects: any[] = [];
    
    // Create horizontal lines
    for (let y = 0; y <= dimensions.height; y += 20) {
      const isLargeLine = y % 100 === 0;
      const lineWidth = isLargeLine ? 1 : 0.5;
      const lineColor = isLargeLine ? '#c0c0c0' : '#e0e0e0';
      
      const line = new fabric.Line([0, y, dimensions.width, y], {
        stroke: lineColor,
        strokeWidth: lineWidth,
        selectable: false,
        evented: false,
        strokeDashArray: isLargeLine ? [] : [5, 5]
      });
      
      // Use canvas.add directly with the line object
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= dimensions.width; x += 20) {
      const isLargeLine = x % 100 === 0;
      const lineWidth = isLargeLine ? 1 : 0.5;
      const lineColor = isLargeLine ? '#c0c0c0' : '#e0e0e0';
      
      const line = new fabric.Line([x, 0, x, dimensions.height], {
        stroke: lineColor,
        strokeWidth: lineWidth,
        selectable: false,
        evented: false,
        strokeDashArray: isLargeLine ? [] : [5, 5]
      });
      
      // Use canvas.add directly with the line object
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Set all grid objects to back if sendToBack exists
    if (canvas.sendToBack) {
      gridObjects.forEach(obj => {
        canvas.sendToBack(obj);
      });
    }
    
    canvas.requestRenderAll();
    
    return gridObjects;
  }
  
  useEffect(() => {
    if (fabricCanvas && gridObjects.length > 0) {
      const width = dimensionsRef.current.width;
      const height = dimensionsRef.current.height;
      
      logger.info("Requesting render for grid with dimensions", { width, height });
      fabricCanvas.requestRenderAll();
    }
  }, [dimensions.width, dimensions.height, fabricCanvas, gridObjects.length]);
  
  // This component doesn't render any DOM elements
  return null;
};
