
import React, { useEffect, useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasControllerEnhanced } from "./controller/CanvasControllerEnhanced";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { resetGridProgress } from "@/utils/gridManager";
import { DrawingMode } from "@/constants/drawingModes";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { captureMessage } from "@/utils/sentry";
import logger from "@/utils/logger";
import { useCanvasOperations } from "@/hooks/canvas-operations";
import { CanvasToolbar } from "./CanvasToolbar";
import { CanvasContainer } from "./CanvasContainer";
import { toast } from "sonner";
import { DebugInfoState, DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";

interface CanvasAppProps {
  setCanvas?: (canvas: FabricCanvas | null) => void;
}

// Inner component that uses DrawingContext
const CanvasAppInner: React.FC<CanvasAppProps> = ({ setCanvas }) => {
  // State for debug info - fixed type consistency
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>(DEFAULT_DEBUG_STATE);
  
  // State for GIA (Gross Internal Area)
  const [gia, setGia] = useState<number>(0);
  
  // State for grid visibility
  const [showGrid, setShowGrid] = useState<boolean>(true);
  
  // Get drawing context
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
  
  // Toggle grid visibility
  const handleToggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);
  
  // Reset initialization state when component mounts
  useEffect(() => {
    resetInitializationState();
    resetGridProgress();
    
    logger.info("CanvasApp mounted", { initialTool: tool });
    captureMessage("CanvasApp initialized", "canvas-app-init", {
      tags: { component: "CanvasApp" },
      extra: { initialTool: tool }
    });
    
    // Welcome message
    toast.success("Floor Plan Editor initialized", {
      id: "canvas-welcome-toast",
      duration: 3000
    });
    
    // Clean up when component unmounts
    return () => {
      cleanupCanvas();
    };
  }, [tool, cleanupCanvas]);
  
  // Handle canvas ref setup
  const handleCanvasRef = (ref: any) => {
    logger.info("Canvas ref received");
    
    // Set the canvas ref
    setCanvasRef(ref);
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      canvasReady: true,
      canvasInitialized: true
    }));
    
    // Enable undo/redo based on history state
    if (ref && ref.history) {
      setCanUndo(ref.history.canUndo());
      setCanRedo(ref.history.canRedo());
    }
  };
  
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
          canUndo={canUndo}
          canRedo={canRedo}
          showGrid={showGrid}
          onToggleGrid={handleToggleGrid}
        />
        <CanvasContainer 
          onCanvasRef={handleCanvasRef}
          debugInfo={debugInfo}
        />
      </div>
    </CanvasControllerEnhanced>
  );
};

// Export the CanvasApp component wrapped with DrawingProvider
export const CanvasApp: React.FC<CanvasAppProps> = (props) => {
  return <CanvasAppInner {...props} />;
};
