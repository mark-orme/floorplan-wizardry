
import React, { useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";
import { useRestorePrompt } from "@/hooks/useRestorePrompt";
import { MeasurementGuideModal } from "@/components/MeasurementGuideModal";
import { startCanvasTracking } from "@/utils/sentry/performance";
import { safeFinish } from "@/utils/sentry/safeFinish";
import { toast } from "sonner";
import { saveCanvasToLocalStorage } from "@/utils/autosave/canvasAutoSave";
import { FloorPlanEditorToolbar } from "./FloorPlanEditorToolbar";
import { MeasurementGuideButton } from "./MeasurementGuideButton";
import { FloorPlanCanvas } from "./FloorPlanCanvas";
import { RestoreDrawingButton } from "./RestoreDrawingButton";
import { DrawingToolbarModals } from "@/components/DrawingToolbarModals";

export const FloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = React.useState<FabricCanvas | null>(null);
  const { setCanUndo, setCanRedo } = useDrawingContext();
  const canvasRef = useRef<any>(null);
  const canvasTransaction = useRef<{ finish: (status: string) => void } | null>(null);

  // Initialize measurement guide hook
  const {
    showMeasurementGuide,
    handleCloseMeasurementGuide,
    openMeasurementGuide,
    setShowMeasurementGuide
  } = useMeasurementGuide();

  // Initialize restore prompt hook
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

  // Auto-save canvas changes
  useEffect(() => {
    if (!canvas) return;

    const handleCanvasModification = () => {
      saveCanvasToLocalStorage(canvas);
    };

    canvas.on('object:modified', handleCanvasModification);
    canvas.on('object:added', handleCanvasModification);
    canvas.on('object:removed', handleCanvasModification);

    return () => {
      canvas.off('object:modified', handleCanvasModification);
      canvas.off('object:added', handleCanvasModification);
      canvas.off('object:removed', handleCanvasModification);
    };
  }, [canvas]);

  const handleCanvasReady = (canvasOperations: any) => {
    setCanvas(canvasOperations.canvas);
    canvasRef.current = canvasOperations;

    if (canvasOperations.canvas) {
      canvasTransaction.current = startCanvasTracking("FloorPlanEditor", canvasOperations.canvas);
      safeFinish(canvasTransaction.current, 'ok');
      
      // Show measurement guide on first canvas load
      const firstVisit = !localStorage.getItem('hasSeenMeasurementGuide');
      if (firstVisit) {
        setShowMeasurementGuide(true);
        localStorage.setItem('hasSeenMeasurementGuide', 'true');
      }
    }
  };

  const handleCanvasOperations = {
    undo: () => {
      if (canvasRef.current?.undo) {
        canvasRef.current.undo();
        setCanUndo(canvasRef.current.canUndo);
        setCanRedo(canvasRef.current.canRedo);
        saveCanvasToLocalStorage(canvas);
      }
    },
    redo: () => {
      if (canvasRef.current?.redo) {
        canvasRef.current.redo();
        setCanUndo(canvasRef.current.canUndo);
        setCanRedo(canvasRef.current.canRedo);
        saveCanvasToLocalStorage(canvas);
      }
    },
    clear: () => {
      if (canvasRef.current?.clearCanvas) {
        canvasRef.current.clearCanvas();
        saveCanvasToLocalStorage(canvas);
      }
    },
    save: () => {
      if (canvasRef.current?.saveCanvas) {
        canvasRef.current.saveCanvas();
        toast.success('Drawing saved successfully');
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
      >
        <DrawingToolbarModals />
      </FloorPlanEditorToolbar>

      <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center bg-gray-50">
        <MeasurementGuideButton onClick={openMeasurementGuide} />
        <FloorPlanCanvas onCanvasReady={handleCanvasReady} />
      </div>

      <MeasurementGuideModal
        open={showMeasurementGuide}
        onClose={() => handleCloseMeasurementGuide(false)}
        onOpenChange={setShowMeasurementGuide}
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
