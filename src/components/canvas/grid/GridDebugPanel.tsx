
import React, { useState, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { RefreshCw, Layers } from "lucide-react";

interface GridDebugPanelProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  visible: boolean;
}

export const GridDebugPanel: React.FC<GridDebugPanelProps> = ({
  fabricCanvasRef,
  gridLayerRef,
  visible
}) => {
  const [gridCount, setGridCount] = useState(0);
  const [canvasInfo, setCanvasInfo] = useState({
    width: 0,
    height: 0,
    objectCount: 0
  });
  
  // Update info when component mounts or refs change
  useEffect(() => {
    if (!visible) return;
    
    const updateInfo = () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      setGridCount(gridLayerRef.current.length);
      setCanvasInfo({
        width: canvas.width || 0,
        height: canvas.height || 0,
        objectCount: canvas.getObjects().length
      });
    };
    
    updateInfo();
    
    // Update periodically
    const intervalId = setInterval(updateInfo, 2000);
    return () => clearInterval(intervalId);
  }, [fabricCanvasRef, gridLayerRef, visible]);
  
  if (!visible) return null;
  
  // Function to dump grid state to console (accepts only canvas and gridObjects)
  const dumpGridState = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    console.log("Grid Debug State:", {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      gridObjects: gridLayerRef.current.length,
      allObjects: canvas.getObjects().length
    });
  };
  
  return (
    <div className="absolute bottom-2 right-2 bg-white/95 p-3 rounded shadow z-50 text-xs">
      <h3 className="font-bold text-sm mb-1">Grid Debug</h3>
      
      <div>
        <span className="font-medium">Canvas:</span> {canvasInfo.width}×{canvasInfo.height}
      </div>
      <div>
        <span className="font-medium">Grid Objects:</span> {gridCount}
      </div>
      <div>
        <span className="font-medium">Total Objects:</span> {canvasInfo.objectCount}
      </div>
      
      <div className="flex gap-1 mt-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={dumpGridState}
        >
          <Layers className="h-3 w-3 mr-1" />
          Dump State
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => console.log("Force refresh grid")}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </div>
    </div>
  );
};
