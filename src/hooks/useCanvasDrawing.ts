
import { useState } from "react";
import { DrawingState, createDefaultDrawingState } from "@/types/DrawingState";
import { DrawingMode } from "@/constants/drawingModes";

interface UseCanvasDrawingProps {
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  onDrawingEnd?: () => void;
}

export const useCanvasDrawing = ({
  tool,
  lineColor,
  lineThickness,
  onDrawingEnd
}: UseCanvasDrawingProps) => {
  const [drawingState, setDrawingState] = useState<DrawingState>(createDefaultDrawingState());
  
  // Mock implementations for handlers (replace with actual implementations)
  const handleMouseDown = (event: any) => {
    console.log("Mouse down", event);
  };
  
  const handleMouseMove = (event: any) => {
    console.log("Mouse move", event);
  };
  
  const handleMouseUp = (event: any) => {
    console.log("Mouse up", event);
    if (onDrawingEnd) {
      onDrawingEnd();
    }
  };
  
  const startDrawing = (point: { x: number; y: number }) => {
    console.log("Start drawing at", point);
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: point,
      currentPoint: point,
      points: [point],
      tool,
      lineColor,
      lineThickness
    }));
  };
  
  const continueDrawing = (point: { x: number; y: number }) => {
    console.log("Continue drawing at", point);
    setDrawingState(prev => ({
      ...prev,
      currentPoint: point,
      points: [...prev.points, point]
    }));
  };
  
  const endDrawing = () => {
    console.log("End drawing");
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false
    }));
    if (onDrawingEnd) {
      onDrawingEnd();
    }
  };

  return {
    drawingState,
    setDrawingState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    startDrawing,
    continueDrawing,
    endDrawing
  };
};
