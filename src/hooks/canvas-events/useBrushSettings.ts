
/**
 * Hook for managing brush settings on the canvas
 * @module useBrushSettings
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";
import { BRUSH_CONSTANTS } from "@/constants/brushConstants";

/**
 * Props for the useBrushSettings hook
 */
interface UseBrushSettingsProps extends BaseEventHandlerProps {
  /** Current drawing tool */
  tool: DrawingTool;
  /** Line color for drawing */
  lineColor: string;
  /** Line thickness for drawing */
  lineThickness: number;
}

/**
 * Hook to manage brush settings for drawing
 * @param {UseBrushSettingsProps} props - Hook properties
 * @returns {EventHandlerResult} Cleanup function
 */
export const useBrushSettings = ({
  fabricCanvasRef,
  tool,
  lineColor = BRUSH_CONSTANTS.DEFAULT_PENCIL_COLOR,
  lineThickness = BRUSH_CONSTANTS.DEFAULT_PENCIL_WIDTH
}: UseBrushSettingsProps): EventHandlerResult => {
  // Update brush settings when tool, color, or thickness changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Set drawing mode based on tool
    canvas.isDrawingMode = tool === 'draw';
    
    // Configure brush properties when drawing is enabled
    if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
      // Set brush color and width
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
      
      // Set brush shadow for better visibility
      canvas.freeDrawingBrush.shadow = new (canvas.freeDrawingBrush.constructor as any).Shadow(
        BRUSH_CONSTANTS.DEFAULT_SHADOW_COLOR,
        0,
        0,
        BRUSH_CONSTANTS.DEFAULT_SHADOW_BLUR
      );
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness]);

  return {
    cleanup: () => {
      // No special cleanup needed
    }
  };
};
