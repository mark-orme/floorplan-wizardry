
/**
 * Hook for managing brush settings for drawing tools
 * @module useBrushSettings
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";
import logger from "@/utils/logger";
import { DEFAULT_LINE_THICKNESS } from "@/constants/numerics";
import { disableSelection, enableSelection } from "@/utils/fabric/selection";

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
   * Valid drawing tool names
   * @constant {Object}
   */
  DRAWING_TOOLS: {
    DRAW: 'draw',
    WALL: 'wall',
    ROOM: 'room',
    STRAIGHT_LINE: 'straightLine'
  }
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
    
    // Check if the current tool is a drawing tool
    const isDrawingTool = 
      tool === BRUSH_SETTINGS.DRAWING_TOOLS.DRAW || 
      tool === BRUSH_SETTINGS.DRAWING_TOOLS.WALL || 
      tool === BRUSH_SETTINGS.DRAWING_TOOLS.ROOM || 
      tool === BRUSH_SETTINGS.DRAWING_TOOLS.STRAIGHT_LINE;
    
    // Set up brush settings based on tool
    if (isDrawingTool) {
      // Configure drawing brush
      if (fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.color = lineColor;
        fabricCanvas.freeDrawingBrush.width = lineThickness;
        
        // Add detailed logging
        console.log(`Brush configured: color=${lineColor}, width=${lineThickness}`);
      } else {
        console.warn("freeDrawingBrush not available on canvas");
      }
      
      // Enable drawing mode only for the draw tool
      fabricCanvas.isDrawingMode = tool === BRUSH_SETTINGS.DRAWING_TOOLS.DRAW;
      
      // For wall, room, and straight line we don't use the native drawing mode,
      // but we still need to disable selection for consistent behavior
      if (tool !== BRUSH_SETTINGS.DRAWING_TOOLS.DRAW) {
        disableSelection(fabricCanvas);
        fabricCanvas.defaultCursor = 'crosshair';
        fabricCanvas.hoverCursor = 'crosshair';
        
        // Add detailed logging
        console.log(`Custom drawing tool (${tool}) enabled: selection disabled, cursor set to crosshair`);
      } else {
        // For the regular draw tool, we also disable selection
        disableSelection(fabricCanvas);
        fabricCanvas.defaultCursor = 'crosshair';
        fabricCanvas.hoverCursor = 'crosshair';
        
        // Add detailed logging
        console.log(`Draw tool enabled: isDrawingMode=${fabricCanvas.isDrawingMode}, selection disabled`);
      }
      
      console.log(`Brush settings updated for ${tool} tool: drawing mode = ${fabricCanvas.isDrawingMode}, color = ${lineColor}, thickness = ${lineThickness}`);
    } else {
      // Disable drawing mode for other tools
      fabricCanvas.isDrawingMode = BRUSH_SETTINGS.DEFAULT_DRAWING_MODE;
      
      // For selection tool, enable selection
      if (tool === 'select') {
        enableSelection(fabricCanvas);
        fabricCanvas.defaultCursor = 'default';
        fabricCanvas.hoverCursor = 'move';
        console.log("Selection mode enabled");
      } else if (tool === 'hand') {
        // For hand tool, disable selection but set appropriate cursor
        disableSelection(fabricCanvas);
        fabricCanvas.defaultCursor = 'grab';
        fabricCanvas.hoverCursor = 'grab';
        console.log("Hand tool mode enabled");
      } else {
        // For other tools, disable selection
        disableSelection(fabricCanvas);
        console.log(`Other tool mode (${tool}) - selection disabled`);
      }
    }
    
    // Force render to apply changes
    fabricCanvas.requestRenderAll();
    
    logger.debug(`Brush settings updated: tool=${tool}, color=${lineColor}, thickness=${lineThickness}, isDrawingTool=${isDrawingTool}`);
    
  }, [fabricCanvasRef, tool, lineColor, lineThickness]);

  return {
    cleanup: () => {
      if (fabricCanvasRef.current) {
        logger.debug("Brush settings cleanup");
      }
    }
  };
};
