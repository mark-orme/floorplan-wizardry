
import React, { useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";
import { useRestorePrompt } from "@/hooks/useRestorePrompt";
import { useCanvasPersistence } from "@/hooks/useCanvasPersistence";
import { MeasurementGuideModal } from "./MeasurementGuideModal";
import { FloorPlanEditorToolbar } from "./canvas/FloorPlanEditorToolbar";
import { MeasurementGuideButton } from "./canvas/MeasurementGuideButton";
import { FloorPlanCanvas } from "./canvas/FloorPlanCanvas";
import { DrawingToolbarModals } from "./DrawingToolbarModals";

export const FloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = React.useState<FabricCanvas | null>(null);
  const { setCanUndo, setCanRedo } = useDrawingContext();
  const canvasRef = useRef<any>(null);

  const {
    showMeasurementGuide,
    handleCloseMeasurementGuide,
    openMeasurementGuide,
    setShowMeasurementGuide
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

  const { saveCanvas, loadCanvas } = useCanvasPersistence(canvas);

  const handleCanvasReady = (canvasOperations: any) => {
    setCanvas(canvasOperations.canvas);
    canvasRef.current = canvasOperations;
    // Show measurement guide on first visit
    const firstVisit = !localStorage.getItem('hasSeenMeasurementGuide');
    if (firstVisit) {
      setShowMeasurementGuide(true);
      localStorage.setItem('hasSeenMeasurementGuide', 'true');
    }
  };

  const handleCanvasOperations = {
    undo: () => {
      if (canvasRef.current?.undo) {
        canvasRef.current.undo();
        setCanUndo(canvasRef.current.canUndo);
        setCanRedo(canvasRef.current.canRedo);
      }
    },
    redo: () => {
      if (canvasRef.current?.redo) {
        canvasRef.current.redo();
        setCanUndo(canvasRef.current.canUndo);
        setCanRedo(canvasRef.current.canRedo);
      }
    },
    clear: () => {
      if (canvasRef.current?.clearCanvas) {
        canvasRef.current.clearCanvas();
      }
    },
    save: saveCanvas
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <FloorPlanEditorToolbar
        onUndo={handleCanvasOperations.undo}
        onRedo={handleCanvasOperations.redo}
        onClear={handleCanvasOperations.clear}
        onSave={handleCanvasOperations.save}
        canUndo={canvasRef.current?.canUndo || false}
        canRedo={canvasRef.current?.canRedo || false}
      >
        <DrawingToolbarModals />
      </FloorPlanEditorToolbar>

      <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center bg-gray-50">
        <MeasurementGuideButton onClick={openMeasurementGuide} />
        <FloorPlanCanvas onCanvasReady={handleCanvasReady} />
      </div>

      <MeasurementGuideModal
        open={showMeasurementGuide}
        onClose={handleCloseMeasurementGuide}
        onOpenChange={setShowMeasurementGuide}
      />
    </div>
  );
};
