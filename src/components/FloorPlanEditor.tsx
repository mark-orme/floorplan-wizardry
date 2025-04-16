
import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingToolbar } from "./canvas/DrawingToolbar";
import { ConnectedDrawingCanvas } from "./canvas/ConnectedDrawingCanvas";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { toast } from "sonner";

export const FloorPlanEditor: React.FC = () => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const { setCanUndo, setCanRedo } = useDrawingContext();
  const canvasRef = useRef<any>(null);

  const handleCanvasReady = (canvasOperations: any) => {
    setCanvas(canvasOperations.canvas);
    canvasRef.current = canvasOperations;
    toast.success("Canvas ready! Start drawing!");
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
      toast.success("Canvas cleared");
    }
  };

  const handleSave = () => {
    if (canvasRef.current?.saveCanvas) {
      canvasRef.current.saveCanvas();
      toast.success("Canvas saved");
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
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
        <ConnectedDrawingCanvas
          width={800}
          height={600}
          onCanvasRef={handleCanvasReady}
        />
      </div>
    </div>
  );
};
