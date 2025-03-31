
import React, { useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasControllerEnhanced } from "./controller/CanvasControllerEnhanced";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { resetGridProgress } from "@/utils/gridManager";
import { DrawingMode } from "@/constants/drawingModes";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { captureMessage } from "@/utils/sentry";
import logger from "@/utils/logger";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { useCanvasOperations } from "@/hooks/useCanvasOperations";
import { CanvasToolbar } from "./CanvasToolbar";
import { CanvasContainer } from "./CanvasContainer";

interface CanvasAppProps {
  setCanvas?: (canvas: FabricCanvas | null) => void;
}

// Inner component that uses DrawingContext
const CanvasAppInner: React.FC<CanvasAppProps> = ({ setCanvas }) => {
  // State for GIA (Gross Internal Area)
  const [gia, setGia] = useState<number>(0);
  const { 
    tool, 
    setTool, 
    lineColor, 
    lineThickness, 
    setLineColor, 
    setLineThickness,
    canUndo,
    canRedo,
    setCanUndo,
    setCanRedo
  } = useDrawingContext();

  // Get canvas operations from custom hook
  const {
    canvasComponentRef,
    setCanvasRef,
    cleanupCanvas,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    handleClear,
    handleSave,
    handleDelete,
    handleLineThicknessChange,
    handleLineColorChange
  } = useCanvasOperations({
    setCanvas,
    tool,
    setTool,
    lineColor,
    lineThickness,
    setLineColor,
    setLineThickness,
    canUndo,
    canRedo,
    setCanUndo,
    setCanRedo
  });
  
  // Reset initialization state when component mounts
  useEffect(() => {
    resetInitializationState();
    resetGridProgress();
    
    logger.info("CanvasApp mounted", { initialTool: tool });
    captureMessage("CanvasApp initialized", "canvas-app-init", {
      tags: { component: "CanvasApp" },
      extra: { initialTool: tool }
    });
    
    // Clean up when component unmounts
    return () => {
      cleanupCanvas();
    };
  }, [tool, cleanupCanvas]);
  
  return (
    <CanvasControllerEnhanced>
      <div className="w-full h-full flex flex-col">
        <CanvasToolbar
          tool={tool}
          onToolChange={handleToolChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onZoom={handleZoom}
          onClear={handleClear}
          onSave={handleSave}
          onDelete={handleDelete}
          gia={gia}
          lineThickness={lineThickness}
          lineColor={lineColor}
          onLineThicknessChange={handleLineThicknessChange}
          onLineColorChange={handleLineColorChange}
        />
        <CanvasContainer onCanvasRef={setCanvasRef} />
      </div>
    </CanvasControllerEnhanced>
  );
};

// Wrapper component that provides DrawingContext
export const CanvasApp: React.FC<CanvasAppProps> = (props) => {
  return (
    <DrawingProvider>
      <CanvasAppInner {...props} />
    </DrawingProvider>
  );
};
