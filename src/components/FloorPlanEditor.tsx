
import React, { useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";
import { useRestorePrompt } from "@/hooks/useRestorePrompt";
import { MeasurementGuideModal } from "./MeasurementGuideModal";
import { startCanvasTracking } from "@/utils/sentry/performance";
import { safeFinish } from "@/utils/sentry/safeFinish";

import { FloorPlanEditorToolbar } from "./canvas/FloorPlanEditorToolbar";
import { MeasurementGuideButton } from "./canvas/MeasurementGuideButton";
import { FloorPlanCanvas } from "./canvas/FloorPlanCanvas";
import { RestoreDrawingButton } from "./canvas/RestoreDrawingButton";

export const FloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = React.useState<FabricCanvas | null>(null);
  const { setCanUndo, setCanRedo } = useDrawingContext();
  const canvasRef = useRef<any>(null);
  const canvasTransaction = useRef<{ finish: (status: string) => void } | null>(null);

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

  const handleCanvasReady = (canvasOperations: any) => {
    setCanvas(canvasOperations.canvas);
    canvasRef.current = canvasOperations;

    if (canvasOperations.canvas) {
      canvasTransaction.current = startCanvasTracking("FloorPlanEditor", canvasOperations.canvas);
      // Explicitly pass 'ok' status to finish method
      safeFinish(canvasTransaction.current, 'ok');
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
    save: () => {
      if (canvasRef.current?.saveCanvas) {
        canvasRef.current.saveCanvas();
      }
    }
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
      />

      <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center bg-gray-50">
        <MeasurementGuideButton onClick={openMeasurementGuide} />
        <FloorPlanCanvas onCanvasReady={handleCanvasReady} />
      </div>

      <MeasurementGuideModal
        open={showMeasurementGuide}
        onClose={handleCloseMeasurementGuide}
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
