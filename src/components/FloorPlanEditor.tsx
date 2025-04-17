
import React, { useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";
import { useRestorePrompt } from "@/hooks/useRestorePrompt";
import { MeasurementGuideModal } from "./MeasurementGuideModal";
import { 
  trackUserInteraction, 
  InteractionCategory 
} from "@/utils/sentry/userInteractions";
import { startCanvasTransaction } from "@/utils/sentry/performance";

// Import the missing components
import { FloorPlanEditorToolbar } from "./canvas/FloorPlanEditorToolbar";
import { MeasurementGuideButton } from "./canvas/MeasurementGuideButton";
import { FloorPlanCanvas } from "./canvas/FloorPlanCanvas";
import { RestoreDrawingButton } from "./canvas/RestoreDrawingButton";

export const FloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = React.useState<FabricCanvas | null>(null);
  const { setCanUndo, setCanRedo } = useDrawingContext();
  const canvasRef = useRef<any>(null);
  
  const { 
    showMeasurementGuide, 
    handleCloseMeasurementGuide,
    openMeasurementGuide 
  } = useMeasurementGuide();

  const {
    showPrompt: showRestorePrompt,
    timeElapsed,
    isRestoring,
    handleRestore,
    handleDismiss
  } = useRestorePrompt({
    canvas,
    canvasId: "main-canvas",
    onRestore: () => {
      setCanUndo(canvasRef.current?.canUndo || false);
      setCanRedo(canvasRef.current?.canRedo || false);
    }
  });

  // Create a ref to hold the transaction
  const canvasTransaction = useRef(
    startCanvasTransaction('FloorPlanEditor', canvas)
  );

  const handleCanvasReady = (canvasOperations: any) => {
    setCanvas(canvasOperations.canvas);
    canvasRef.current = canvasOperations;
    
    // Finish the transaction with success status
    canvasTransaction.current.finish('ok', {
      canvasWidth: canvasOperations.canvas.width,
      canvasHeight: canvasOperations.canvas.height
    });
  };

  const handleUndo = () => {
    if (canvasRef.current?.undo) {
      canvasRef.current.undo();
      setCanUndo(canvasRef.current.canUndo);
      setCanRedo(canvasRef.current.canRedo);
    }
  };

  const handleRedo = () => {
    if (canvasRef.current?.redo) {
      canvasRef.current.redo();
      setCanUndo(canvasRef.current.canUndo);
      setCanRedo(canvasRef.current.canRedo);
    }
  };

  const handleClear = () => {
    if (canvasRef.current?.clearCanvas) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleSave = () => {
    if (canvasRef.current?.saveCanvas) {
      canvasRef.current.saveCanvas();
    }
  };

  const handleOpenMeasurementGuide = () => {
    openMeasurementGuide();
  };
  
  const handleCloseMeasurementGuideWithTracking = () => {
    trackUserInteraction('close_measurement_guide', InteractionCategory.TOOL);
    handleCloseMeasurementGuide();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <FloorPlanEditorToolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
        canUndo={canvasRef.current?.canUndo || false}
        canRedo={canvasRef.current?.canRedo || false}
      />
      
      <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center bg-gray-50">
        <MeasurementGuideButton onClick={handleOpenMeasurementGuide} />
        
        <FloorPlanCanvas onCanvasReady={handleCanvasReady} />
      </div>
      
      <MeasurementGuideModal 
        open={showMeasurementGuide} 
        onClose={handleCloseMeasurementGuideWithTracking} 
      />
      
      <RestoreDrawingButton
        showPrompt={showRestorePrompt}
        timeElapsed={timeElapsed}
        isRestoring={isRestoring}
        onRestore={handleRestore}
        onDismiss={handleDismiss}
      />
    </div>
  );
};
