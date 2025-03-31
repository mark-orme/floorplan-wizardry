
import React, { useEffect, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { GridRenderer } from "./GridRenderer";

interface GridLayerProps {
  fabricCanvas: FabricCanvas;
  dimensions: { width: number; height: number };
  showDebug?: boolean;
}

export const GridLayer: React.FC<GridLayerProps> = ({
  fabricCanvas,
  dimensions,
  showDebug = false
}) => {
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);
  
  // Handle grid creation
  const handleGridCreated = (objects: FabricObject[]) => {
    setGridObjects(objects);
  };
  
  // Update grid when dimensions change
  useEffect(() => {
    if (fabricCanvas && gridObjects.length > 0) {
      fabricCanvas.requestRenderAll();
    }
  }, [dimensions, fabricCanvas, gridObjects]);
  
  return (
    <GridRenderer 
      canvas={fabricCanvas}
      onGridCreated={handleGridCreated}
      showGrid={true}
    />
  );
};
