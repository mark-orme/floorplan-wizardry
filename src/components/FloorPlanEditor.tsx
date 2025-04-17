
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
import { RestoreDrawingPrompt } from "./canvas/RestoreDrawingPrompt";
import { useRestorePrompt } from "@/hooks/useRestorePrompt";
import { useSentryCanvasMonitoring } from "@/hooks/useSentryCanvasMonitoring";
import { startPerformanceTransaction } from "@/utils/sentry/performance";
import { configureSentryContext } from "@/utils/sentry/initialization";

export const FloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const { setCanUndo, setCanRedo } = useDrawingContext();
  const canvasRef = useRef<any>(null);
  const { 
    showMeasurementGuide, 
    handleCloseMeasurementGuide,
    openMeasurementGuide 
  } = useMeasurementGuide();

  // Initialize Sentry canvas monitoring
  const { captureCanvasState } = useSentryCanvasMonitoring({
    canvas,
    enabled: true
  });

  // Use restore prompt hook
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
    // Track canvas initialization performance
    const transaction = startPerformanceTransaction('canvas.initialization');
    
    try {
      setCanvas(canvasOperations.canvas);
      canvasRef.current = canvasOperations;
      
      // Update Sentry context with canvas info
      configureSentryContext({
        canvasInfo: {
          width: canvasOperations.canvas.width,
          height: canvasOperations.canvas.height,
          objectCount: canvasOperations.canvas.getObjects().length
        }
      });
      
      toast.success("Canvas ready! Start drawing!");
      logger.info("Canvas initialized successfully");
      
      transaction.finish('ok');
    } catch (error) {
      logger.error("Error initializing canvas:", error);
      transaction.finish('error');
    }
  };

  const handleUndo = () => {
    if (canvasRef.current?.undo) {
      canvasRef.current.undo();
      setCanUndo(canvasRef.current.canUndo);
      setCanRedo(canvasRef.current.canRedo);
      logger.debug("Undo operation performed");
      
      // Capture canvas state after undo
      captureCanvasState();
    }
  };

  const handleRedo = () => {
    if (canvasRef.current?.redo) {
      canvasRef.current.redo();
      setCanUndo(canvasRef.current.canUndo);
      setCanRedo(canvasRef.current.canRedo);
      logger.debug("Redo operation performed");
      
      // Capture canvas state after redo
      captureCanvasState();
    }
  };

  const handleClear = () => {
    if (canvasRef.current?.clearCanvas) {
      canvasRef.current.clearCanvas();
      toast.success("Canvas cleared");
      logger.info("Canvas cleared by user");
      
      // Capture canvas state after clear
      captureCanvasState();
    }
  };

  const handleSave = () => {
    if (canvasRef.current?.saveCanvas) {
      const transaction = startPerformanceTransaction('canvas.save');
      
      try {
        canvasRef.current.saveCanvas();
        toast.success("Canvas saved");
        logger.info("Canvas state saved");
        transaction.finish('ok');
      } catch (error) {
        logger.error("Error saving canvas:", error);
        toast.error("Failed to save canvas");
        transaction.finish('error');
      }
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
      
      {showRestorePrompt && (
        <RestoreDrawingPrompt
          timeElapsed={timeElapsed}
          onRestore={handleRestore}
          onDismiss={handleDismiss}
          isRestoring={isRestoring}
        />
      )}
    </div>
  );
};
