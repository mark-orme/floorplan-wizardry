
import React from "react";
import { ConnectedDrawingCanvas } from "./ConnectedDrawingCanvas";
import { useSentryCanvasMonitoring } from "@/hooks/useSentryCanvasMonitoring";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { startPerformanceTransaction, startCanvasTransaction } from "@/utils/sentry/performance";
import { configureSentryContext } from "@/utils/sentry/initialization";
import { trackCanvasOperation } from "@/utils/sentry/userInteractions";
import logger from "@/utils/logger";

interface FloorPlanCanvasProps {
  onCanvasReady: (canvasOperations: any) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ onCanvasReady }) => {
  const [canvas, setCanvas] = React.useState<FabricCanvas | null>(null);

  const { captureCanvasState } = useSentryCanvasMonitoring({
    canvas,
    enabled: true
  });

  const handleCanvasReady = (canvasOperations: any) => {
    // Start a performance transaction with the proper name and options
    const transaction = startPerformanceTransaction('canvas.initialization', canvasOperations.canvas, {
      op: 'canvas'
    });
    
    try {
      setCanvas(canvasOperations.canvas);
      
      configureSentryContext({
        canvasInfo: {
          width: canvasOperations.canvas.width,
          height: canvasOperations.canvas.height,
          objectCount: canvasOperations.canvas.getObjects().length
        }
      });
      
      trackCanvasOperation('initialized', {
        width: canvasOperations.canvas.width,
        height: canvasOperations.canvas.height,
        objectCount: canvasOperations.canvas.getObjects().length,
        renderingBackend: canvasOperations.canvas.contextContainer?.constructor?.name || 'unknown'
      });
      
      toast.success("Canvas ready! Start drawing!");
      logger.info("Canvas initialized successfully");
      
      // Call the parent's onCanvasReady callback
      onCanvasReady(canvasOperations);
      
      // Finish the transaction with success status
      transaction.finish('ok');
    } catch (error) {
      logger.error("Error initializing canvas:", error);
      
      // Finish the transaction with error status
      transaction.finish('error');
    }
  };

  return (
    <ConnectedDrawingCanvas
      width={800}
      height={600}
      onCanvasRef={handleCanvasReady}
    />
  );
};
