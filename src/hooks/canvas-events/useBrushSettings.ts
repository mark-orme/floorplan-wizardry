/**
 * Hook for managing canvas brush settings
 * @module useBrushSettings
 */
import { useEffect, useRef } from "react";
import type { Canvas as FabricCanvas, TEvent, BaseBrush } from "fabric";
import { BaseEventHandlerProps, EventHandlerResult } from "./types";
import { DrawingTool } from "@/hooks/useCanvasState";
import logger from "@/utils/logger";
import { BRUSH_CONSTANTS } from "@/constants/brushConstants";

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
 * Interface for brush settings
 */
interface BrushSettings {
  /** Brush color */
  color: string;
  /** Brush width */
  width: number;
  /** Brush opacity */
  opacity?: number;
  /** Brush shadow color */
  shadowColor?: string;
  /** Brush shadow blur */
  shadowBlur?: number;
}

/**
 * Hook to manage brush settings for drawing
 * @param {UseBrushSettingsProps} props - Hook properties
 * @returns {EventHandlerResult} Cleanup function
 */
export const useBrushSettings = ({
  fabricCanvasRef,
  tool,
  lineColor,
  lineThickness
}: UseBrushSettingsProps): EventHandlerResult => {
  // Keep track of previous settings for optimization
  const prevSettingsRef = useRef<{
    color: string;
    width: number;
    tool: DrawingTool;
  }>({
    color: lineColor,
    width: lineThickness,
    tool: tool
  });
  
  // Update brush settings when props change
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const brush = canvas.freeDrawingBrush;
    
    if (!brush) {
      logger.warn("Cannot update brush settings: Brush not initialized");
      return;
    }
    
    const prevSettings = prevSettingsRef.current;
    
    // Only update if settings have changed
    if (
      prevSettings.color !== lineColor ||
      prevSettings.width !== lineThickness ||
      prevSettings.tool !== tool
    ) {
      logger.info("Updating brush settings:", { 
        color: lineColor, 
        width: lineThickness,
        tool: tool
      });
      
      // Update brush properties
      brush.color = lineColor;
      brush.width = lineThickness;
      
      // Update drawing mode based on tool
      canvas.isDrawingMode = tool === 'draw';
      
      // Add customizations based on the tool
      if (tool === 'draw') {
        // Apply additional brush settings for freehand drawing
        brush.opacity = BRUSH_CONSTANTS.DEFAULT_OPACITY;
        
        // Add shadow if supported by the brush
        if ('shadowColor' in brush) {
          (brush as unknown as { shadowColor: string }).shadowColor = BRUSH_CONSTANTS.DEFAULT_SHADOW_COLOR;
        }
        
        if ('shadowBlur' in brush) {
          (brush as unknown as { shadowBlur: number }).shadowBlur = BRUSH_CONSTANTS.DEFAULT_SHADOW_BLUR;
        }
      }
      
      // Save current settings as previous
      prevSettingsRef.current = {
        color: lineColor,
        width: lineThickness,
        tool: tool
      };
    }
  }, [fabricCanvasRef, tool, lineColor, lineThickness]);
  
  return {
    cleanup: () => {
      logger.debug("Brush settings cleanup");
    }
  };
};

/**
 * Declare extension to Fabric module
 */
declare module 'fabric' {
  interface BaseBrush {
    color: string;
    width: number;
    opacity?: number;
  }
}
