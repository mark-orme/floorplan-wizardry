
import React, { useEffect, useRef, useState } from "react";
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
  // Add ref to track if grid has been initialized
  const gridInitializedRef = useRef(false);
  
  // Handle grid creation
  const handleGridCreated = (objects: FabricObject[]) => {
    if (!gridInitializedRef.current) {
      setGridObjects(objects);
      gridInitializedRef.current = true;
    }
  };
  
  // Update grid when dimensions change substantially
  useEffect(() => {
    if (fabricCanvas && gridObjects.length > 0) {
      fabricCanvas.requestRenderAll();
    }
  }, [dimensions, fabricCanvas]); // Don't include gridObjects in dependencies
  
  return (
    <GridRenderer 
      canvas={fabricCanvas}
      onGridCreated={handleGridCreated}
      showGrid={true}
    />
  );
};
