
import React from "react";
import { trackUserInteraction, InteractionCategory } from "@/utils/sentry/userInteractions";
import { startCanvasTracking } from "@/utils/sentry/performance";
import { safeFinish } from "@/utils/sentry/safeFinish";

interface FloorPlanCanvasProps {
  onCanvasReady: (canvasOperations: any) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ onCanvasReady }) => {
  const handleCanvasRef = (canvasOperations: any) => {
    if (canvasOperations && canvasOperations.canvas) {
      trackUserInteraction("canvas_initialized", InteractionCategory.CANVAS);
      
      // Start performance tracking
      const canvasTransaction = startCanvasTracking("FloorPlanCanvas", canvasOperations.canvas);
      
      // Pass the canvas operations to the parent component
      onCanvasReady(canvasOperations);
      
      // Always finish the transaction with 'ok' status
      safeFinish(canvasTransaction, 'ok');
    }
  };

  return (
    <div className="w-full max-w-4xl border border-gray-200 rounded shadow-sm bg-white">
      <ConnectedDrawingCanvas
        width={800}
        height={600}
        onCanvasRef={handleCanvasRef}
      />
    </div>
  );
};

// Import the ConnectedDrawingCanvas component
import { ConnectedDrawingCanvas } from "./ConnectedDrawingCanvas";
