
import React, { useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";
import { useRestorePrompt } from "@/hooks/useRestorePrompt";
import { useCanvasPersistence } from "@/hooks/useCanvasPersistence";
import { MeasurementGuideModal } from "./MeasurementGuideModal";
import { FloorPlanEditorToolbar } from "./canvas/FloorPlanEditorToolbar";
import { FloorPlanCanvas } from "./canvas/FloorPlanCanvas";
import { DrawingToolbarModals } from "./DrawingToolbarModals";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileToolbar } from "./canvas/MobileToolbar";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";

export const FloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = React.useState<FabricCanvas | null>(null);
  const { tool, setTool, setCanUndo, setCanRedo } = useDrawingContext();
  const canvasRef = useRef<any>(null);
  const isMobile = useIsMobile();

  const {
    showMeasurementGuide,
    handleCloseMeasurementGuide,
    openMeasurementGuide,
    setShowMeasurementGuide
  } = useMeasurementGuide();

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
    // Load any saved canvas state
    loadCanvas();

    if (isMobile) {
      toast.info("Mobile view detected. Use toolbar at bottom for drawing tools.", {
        duration: 5000
      });
    }
  };

  // Auto-save canvas changes
  useEffect(() => {
    if (!canvas) return;

    const handleCanvasModification = () => {
      saveCanvas();
    };

    canvas.on('object:modified', handleCanvasModification);
    canvas.on('object:added', handleCanvasModification);
    canvas.on('object:removed', handleCanvasModification);

    return () => {
      canvas.off('object:modified', handleCanvasModification);
      canvas.off('object:added', handleCanvasModification);
      canvas.off('object:removed', handleCanvasModification);
    };
  }, [canvas, saveCanvas]);

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

  const handleToolChange = (newTool: DrawingMode) => {
    setTool(newTool);
  };

  const handleZoomIn = () => {
    if (canvas) {
      const currentZoom = canvas.getZoom();
      canvas.setZoom(Math.min(currentZoom * 1.2, 5.0));
      canvas.renderAll();
    }
  };

  const handleZoomOut = () => {
    if (canvas) {
      const currentZoom = canvas.getZoom();
      canvas.setZoom(Math.max(currentZoom / 1.2, 0.5));
      canvas.renderAll();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {!isMobile && (
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
      )}

      <div className={`flex-1 overflow-auto ${isMobile ? 'p-0' : 'p-4'} flex flex-col items-center justify-center bg-gray-50`}>
        <FloorPlanCanvas onCanvasReady={handleCanvasReady} />
      </div>

      {isMobile && canvas && (
        <MobileToolbar
          activeTool={tool}
          onToolChange={handleToolChange}
          onUndo={handleCanvasOperations.undo}
          onRedo={handleCanvasOperations.redo}
          onClear={handleCanvasOperations.clear}
          onSave={handleCanvasOperations.save}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      )}

      <MeasurementGuideModal
        open={showMeasurementGuide}
        onClose={() => handleCloseMeasurementGuide(false)}
        onOpenChange={setShowMeasurementGuide}
      />
    </div>
  );
};
