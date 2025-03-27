
/**
 * Hook for managing line settings in the canvas controller
 * @module useCanvasControllerLineSettings
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";

/**
 * Props for the useCanvasControllerLineSettings hook
 * 
 * @interface UseCanvasControllerLineSettingsProps
 * @property {React.MutableRefObject<FabricCanvas | null>} fabricCanvasRef - Reference to the Fabric.js canvas instance
 * @property {number} lineThickness - Current line thickness setting
 * @property {string} lineColor - Current line color setting
 * @property {DrawingTool} tool - Currently selected drawing tool
 * @property {React.Dispatch<React.SetStateAction<number>>} setLineThickness - Function to update line thickness
 * @property {React.Dispatch<React.SetStateAction<string>>} setLineColor - Function to update line color
 */
interface UseCanvasControllerLineSettingsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineThickness: number;
  lineColor: string;
  tool: DrawingTool;
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Hook that handles line settings in the canvas controller
 * Provides functions to update brush thickness and color
 * 
 * @param {UseCanvasControllerLineSettingsProps} props - Hook properties
 * @returns {Object} Line setting handler functions
 */
export const useCanvasControllerLineSettings = (props: UseCanvasControllerLineSettingsProps) => {
  const {
    fabricCanvasRef,
    lineThickness,
    lineColor,
    tool,
    setLineThickness,
    setLineColor
  } = props;

  /**
   * Handle line thickness change
   * Updates both state and canvas brush properties
   * 
   * @param {number} thickness - New line thickness value
   */
  const handleLineThicknessChange = useCallback((thickness: number) => {
    setLineThickness(thickness);
    
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.width = thickness;
    }
  }, [fabricCanvasRef, setLineThickness]);

  /**
   * Handle line color change
   * Updates both state and canvas brush properties
   * 
   * @param {string} color - New line color value
   */
  const handleLineColorChange = useCallback((color: string) => {
    setLineColor(color);
    
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = color;
    }
  }, [fabricCanvasRef, setLineColor]);

  return {
    handleLineThicknessChange,
    handleLineColorChange
  };
};
