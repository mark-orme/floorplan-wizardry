
/**
 * Hook for managing brush settings for drawing tools
 * @module useBrushSettings
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";
import logger from "@/utils/logger";
import { DEFAULT_LINE_THICKNESS } from "@/constants/numerics";

/**
 * Constants for brush settings
 * @constant {Object}
 */
const BRUSH_SETTINGS = {
  /**
   * Default drawing mode state (disabled)
   * @constant {boolean}
   */
  DEFAULT_DRAWING_MODE: false,
  
  /**
   * Valid drawing tool name
   * @constant {string}
   */
  DRAWING_TOOL: 'draw'
};

/**
 * Props for the useBrushSettings hook
 */
interface UseBrushSettingsProps extends BaseEventHandlerProps {
  /** Current line color */
  lineColor: string;
  /** Current line thickness */
  lineThickness: number;
}

/**
 * Hook to set up brush settings for drawing tools
 * @param {UseBrushSettingsProps} props - Hook properties
 * @returns {EventHandlerResult} Cleanup function
 */
export const useBrushSettings = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness = DEFAULT_LINE_THICKNESS
}: UseBrushSettingsProps): EventHandlerResult => {
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    // Set up brush settings based on tool
    if (tool === BRUSH_SETTINGS.DRAWING_TOOL) {
      // Configure drawing brush
      if (fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.color = lineColor;
        fabricCanvas.freeDrawingBrush.width = lineThickness;
      }
      
      // Enable drawing mode
      fabricCanvas.isDrawingMode = true;
    } else {
      // Disable drawing mode for other tools
      fabricCanvas.isDrawingMode = BRUSH_SETTINGS.DEFAULT_DRAWING_MODE;
    }
    
    logger.debug(`Brush settings updated: tool=${tool}, color=${lineColor}, thickness=${lineThickness}`);
    
  }, [fabricCanvasRef, tool, lineColor, lineThickness]);

  return {
    cleanup: () => {
      if (fabricCanvasRef.current) {
        logger.debug("Brush settings cleanup");
      }
    }
  };
};
