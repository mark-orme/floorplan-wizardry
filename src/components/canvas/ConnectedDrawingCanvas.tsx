
import React, { useEffect, useState } from "react";
import { useCanvasController } from "./controller/CanvasControllerEnhanced";
import { EnhancedCanvas } from "./EnhancedCanvas";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasEventManager } from "./CanvasEventManager";
import { toast } from "sonner";

interface ConnectedDrawingCanvasProps {
  width?: number;
  height?: number;
}

export const ConnectedDrawingCanvas: React.FC<ConnectedDrawingCanvasProps> = ({
  width = 800,
  height = 600
}) => {
  const {
    tool,
    lineThickness,
    lineColor,
    gridLayerRef,
    fabricCanvasRef,
    setHasError,
    setErrorMessage,
    checkAndFixGrid,
    forceGridCreation
  } = useCanvasController();
  
  const [canvasCreated, setCanvasCreated] = useState(false);
  
  // Handle canvas ready event
  const handleCanvasReady = (canvas: FabricCanvas) => {
    fabricCanvasRef.current = canvas;
    setCanvasCreated(true);
    toast.success("Drawing canvas ready");
    
    // Ensure grid is properly set up
    setTimeout(() => {
      checkAndFixGrid();
    }, 100);
  };
  
  // Handle canvas error
  const handleCanvasError = (error: Error) => {
    console.error("Canvas error:", error);
    setHasError(true);
    setErrorMessage(error.message);
    toast.error(`Canvas error: ${error.message}`);
  };
  
  // Mock functions for CanvasEventManager that would be implemented fully
  const saveCurrentState = () => {
    console.log("Saving canvas state");
    // Implementation would save the current state for undo/redo
  };
  
  const undo = () => {
    console.log("Undo");
    // Implementation would restore previous state
  };
  
  const redo = () => {
    console.log("Redo");
    // Implementation would restore next state
  };
  
  const deleteSelectedObjects = () => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length > 0) {
      canvas.remove(...activeObjects);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      toast.info("Objects deleted");
    }
  };
  
  // Handle emergency grid creation if needed
  useEffect(() => {
    if (canvasCreated && fabricCanvasRef.current) {
      // Check if grid exists, if not create one
      if (gridLayerRef.current.length === 0) {
        console.log("No grid found, creating emergency grid");
        forceGridCreation();
      }
    }
  }, [canvasCreated, gridLayerRef, fabricCanvasRef, forceGridCreation]);
  
  return (
    <div className="w-full h-full" data-testid="connected-drawing-canvas">
      <EnhancedCanvas
        width={width}
        height={height}
        tool={tool}
        onCanvasReady={handleCanvasReady}
        onError={handleCanvasError}
      />
      
      {canvasCreated && fabricCanvasRef.current && (
        <CanvasEventManager
          canvas={fabricCanvasRef.current}
          tool={tool}
          lineThickness={lineThickness}
          lineColor={lineColor}
          gridLayerRef={gridLayerRef}
          saveCurrentState={saveCurrentState}
          undo={undo}
          redo={redo}
          deleteSelectedObjects={deleteSelectedObjects}
        />
      )}
    </div>
  );
};
