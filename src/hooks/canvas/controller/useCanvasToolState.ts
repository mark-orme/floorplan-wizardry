
/**
 * Hook for managing canvas tool state
 * Handles tool selection and state changes
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { DrawingTool } from "@/types/core/DrawingTool";
import { toast } from "sonner";
import logger from "@/utils/logger";

/**
 * Props for useCanvasToolState hook
 */
interface UseCanvasToolStateProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingTool;
  /** Function to set the current tool */
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  /** Line thickness */
  lineThickness: number;
  /** Line color */
  lineColor: string;
  /** Zoom level */
  zoomLevel: number;
  /** Function to set zoom level */
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook that manages canvas tool state and changes
 * 
 * This hook is responsible for:
 * 1. Validating tool selections against the DrawingMode enum
 * 2. Applying tool-specific settings to the fabric canvas
 * 3. Managing zoom state
 * 4. Providing user feedback through toast notifications
 * 5. Handling errors during tool changes
 * 
 * Usage example:
 * ```tsx
 * const { handleToolChange, handleZoom } = useCanvasToolState({
 *   fabricCanvasRef,
 *   tool,
 *   setTool,
 *   lineThickness,
 *   lineColor,
 *   zoomLevel,
 *   setZoomLevel
 * });
 * 
 * // Change the current tool
 * handleToolChange(DrawingMode.DRAW);
 * 
 * // Zoom the canvas
 * handleZoom(1.2); // Zoom in 20%
 * ```
 */
export const useCanvasToolState = ({
  fabricCanvasRef,
  tool,
  setTool,
  lineThickness,
  lineColor,
  zoomLevel,
  setZoomLevel
}: UseCanvasToolStateProps) => {
  /**
   * Validate if a value is a valid DrawingTool
   * 
   * Performs runtime type checking to ensure the value is:
   * 1. A string
   * 2. A valid value from the DrawingMode enum
   * 
   * @param {unknown} value - Value to check
   * @returns {boolean} Whether value is a valid DrawingTool
   */
  const isValidDrawingTool = useCallback((value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    return Object.values(DrawingMode).includes(value as DrawingMode);
  }, []);

  /**
   * Handle tool change
   * 
   * This function:
   * 1. Validates the new tool
   * 2. Updates the tool state
   * 3. Configures the fabric canvas based on the tool
   * 4. Handles errors and provides user feedback
   * 
   * Each tool requires different canvas settings:
   * - SELECT: Enables object selection, disables drawing mode
   * - DRAW: Enables free drawing with the current brush settings
   * - Other tools: Disables drawing mode, applies tool-specific settings
   * 
   * @param {DrawingTool} newTool - The tool to switch to
   */
  const handleToolChange = useCallback((newTool: DrawingTool): void => {
    logger.info("Tool change requested", { 
      previousTool: tool, 
      newTool 
    });
    
    // Validate the tool is a valid DrawingMode enum value
    if (!isValidDrawingTool(newTool)) {
      console.warn(`Tool validation failed: ${newTool}`, { expected: Object.values(DrawingMode) });
      logger.error("Invalid drawing tool selected", { invalidTool: newTool, allowedTools: Object.values(DrawingMode) });
      toast.error('Invalid drawing tool selected');
      return;
    }
    
    try {
      setTool(newTool);
      
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      // Apply tool-specific settings
      switch (newTool) {
        case DrawingMode.SELECT:
          canvas.isDrawingMode = false;
          canvas.selection = true;
          break;
          
        case DrawingMode.DRAW:
          canvas.isDrawingMode = true;
          if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = lineThickness;
            canvas.freeDrawingBrush.color = lineColor;
          }
          break;
          
        default:
          canvas.isDrawingMode = false;
          break;
      }
      
      toast.success(`Changed to ${newTool} tool`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to change drawing tool", { 
        error: errorMsg, 
        previousTool: tool, 
        newTool 
      });
      
      toast.error(`Failed to change tool: ${errorMsg}`);
    }
  }, [fabricCanvasRef, lineThickness, lineColor, setTool, tool, isValidDrawingTool]);
  
  /**
   * Handle zoom change
   * 
   * Applies a zoom factor to the current zoom level and updates the canvas view.
   * A zoom factor > 1 zooms in, < 1 zooms out.
   * 
   * This function:
   * 1. Calculates the new zoom level
   * 2. Updates the zoom state
   * 3. Applies zoom to the canvas
   * 4. Provides user feedback
   * 
   * @param {number} zoomFactor - Multiplier for current zoom (e.g. 1.1 = zoom in 10%)
   */
  const handleZoom = useCallback((zoomFactor: number): void => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const newZoom = zoomLevel * zoomFactor;
    setZoomLevel(newZoom);
    
    canvas.setZoom(newZoom);
    canvas.requestRenderAll();
    
    toast.success(`Zoom set to ${Math.round(newZoom * 100)}%`);
  }, [fabricCanvasRef, zoomLevel, setZoomLevel]);
  
  return {
    handleToolChange,
    handleZoom,
    isValidDrawingTool
  };
};
