
import React, { useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";
import { useCanvasPersistence } from "@/hooks/useCanvasPersistence";
import { MeasurementGuideModal } from "./MeasurementGuideModal";
import { FloorPlanEditorToolbar } from "./canvas/FloorPlanEditorToolbar";
import { EditorContent } from "./canvas/EditorContent";
import { DrawingToolbarModals } from "./DrawingToolbarModals";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";

export const FloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = React.useState<FabricCanvas | null>(null);
  const { activeTool, setActiveTool, lineColor, lineThickness, setCanUndo, setCanRedo } = useDrawingContext();
  const canvasRef = useRef<any>(null);
  const [showGridDebug, setShowGridDebug] = React.useState(true);

  const {
    showMeasurementGuide,
    handleCloseMeasurementGuide,
    openMeasurementGuide,
    setShowMeasurementGuide
  } = useMeasurementGuide();

  const { saveCanvas, loadCanvas } = useCanvasPersistence(canvas);

  const handleCanvasReady = (canvasOperations: any) => {
    setCanvas(canvasOperations);
    canvasRef.current = canvasOperations;
    loadCanvas();
    console.log("Canvas ready in FloorPlanEditor");
  };

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
    save: saveCanvas,
    toggleGrid: () => {
      setShowGridDebug(!showGridDebug);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <EditorContent
        forceRefreshKey={0}
        setCanvas={handleCanvasReady}
        showGridDebug={showGridDebug}
        tool={activeTool}
        lineThickness={lineThickness}
        lineColor={lineColor}
        enableSync={true}
        onToolChange={setActiveTool}
        onLineThicknessChange={(thickness) => {}}
        onLineColorChange={(color) => {}}
        onUndo={handleCanvasOperations.undo}
        onRedo={handleCanvasOperations.redo}
        onClear={handleCanvasOperations.clear}
        onSave={handleCanvasOperations.save}
      />

      <MeasurementGuideModal
        open={showMeasurementGuide}
        onClose={() => handleCloseMeasurementGuide(false)}
        onOpenChange={setShowMeasurementGuide}
      />
    </div>
  );
};
