
import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingToolbar } from "./canvas/DrawingToolbar";
import { ConnectedDrawingCanvas } from "./canvas/ConnectedDrawingCanvas";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";
import { MeasurementGuideModal } from "./MeasurementGuideModal";
import logger from "@/utils/logger";

export const FloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const { setCanUndo, setCanRedo } = useDrawingContext();
  const canvasRef = useRef<any>(null);
  const { 
    showMeasurementGuide, 
    handleCloseMeasurementGuide,
    openMeasurementGuide 
  } = useMeasurementGuide();

  const handleCanvasReady = (canvasOperations: any) => {
    setCanvas(canvasOperations.canvas);
    canvasRef.current = canvasOperations;
    toast.success("Canvas ready! Start drawing!");
    logger.info("Canvas initialized successfully");
  };

  const handleUndo = () => {
    if (canvasRef.current?.undo) {
      canvasRef.current.undo();
      setCanUndo(canvasRef.current.canUndo);
      setCanRedo(canvasRef.current.canRedo);
      logger.debug("Undo operation performed");
    }
  };

  const handleRedo = () => {
    if (canvasRef.current?.redo) {
      canvasRef.current.redo();
      setCanUndo(canvasRef.current.canUndo);
      setCanRedo(canvasRef.current.canRedo);
      logger.debug("Redo operation performed");
    }
  };

  const handleClear = () => {
    if (canvasRef.current?.clearCanvas) {
      canvasRef.current.clearCanvas();
      toast.success("Canvas cleared");
      logger.info("Canvas cleared by user");
    }
  };

  const handleSave = () => {
    if (canvasRef.current?.saveCanvas) {
      canvasRef.current.saveCanvas();
      toast.success("Canvas saved");
      logger.info("Canvas state saved");
    }
  };

  // Update undo/redo state
  useEffect(() => {
    if (canvasRef.current) {
      setCanUndo(canvasRef.current.canUndo || false);
      setCanRedo(canvasRef.current.canRedo || false);
    }
  }, [canvas, setCanUndo, setCanRedo]);

  return (
    <div className="flex flex-col h-full bg-white">
      <DrawingToolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
      />
      <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center bg-gray-50">
        <div className="flex justify-end w-full mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openMeasurementGuide}
            className="flex items-center gap-1"
          >
            <Ruler className="h-4 w-4" />
            <span>Measurement Guide</span>
          </Button>
        </div>
        <ConnectedDrawingCanvas
          width={800}
          height={600}
          onCanvasRef={handleCanvasReady}
        />
      </div>
      
      <MeasurementGuideModal 
        open={showMeasurementGuide} 
        onClose={handleCloseMeasurementGuide} 
      />
    </div>
  );
};
