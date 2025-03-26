
/**
 * Hook for managing brush settings
 * @module useBrushSettings
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { BaseEventHandlerProps } from "./types";

interface UseBrushSettingsProps extends BaseEventHandlerProps {
  /** Current line color */
  lineColor: string;
  /** Current line thickness */
  lineThickness: number;
}

/**
 * Hook to handle brush settings
 */
export const useBrushSettings = ({
  fabricCanvasRef,
  lineColor,
  lineThickness
}: UseBrushSettingsProps) => {
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      fabricCanvas.freeDrawingBrush.color = lineColor;
    }
    
  }, [fabricCanvasRef, lineColor, lineThickness]);
};
