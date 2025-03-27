
/**
 * Custom hook for managing line settings
 * @module useLineSettings
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { trackLineThickness } from "@/utils/fabricBrush";
import { UI_MESSAGES } from "@/constants/uiConstants";

/**
 * Constants for line settings functionality
 * @constant {Object}
 */
const LINE_SETTINGS_CONSTANTS = {
  /**
   * Toast display duration in milliseconds
   * @constant {number}
   */
  TOAST_DURATION: 2000
};

interface UseLineSettingsProps {
  fabricCanvasRef: React.MutableRefObject<any>;
  lineThickness: number;
  lineColor: string;
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Hook for managing line thickness and color settings
 * @param {UseLineSettingsProps} props - Hook properties
 * @returns {Object} Line settings handlers
 */
export const useLineSettings = ({
  fabricCanvasRef,
  lineThickness,
  lineColor,
  setLineThickness,
  setLineColor
}: UseLineSettingsProps) => {
  
  /**
   * Handle line thickness changes
   * @param thickness - New line thickness value
   */
  const handleLineThicknessChange = useCallback((thickness: number) => {
    setLineThickness(thickness);
    
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.width = thickness;
      
      // Track baseline thickness for stylus pressure references
      trackLineThickness(fabricCanvasRef.current, thickness);
      
      toast.success(`${UI_MESSAGES.LINE_THICKNESS_UPDATED} ${thickness}px`, {
        duration: LINE_SETTINGS_CONSTANTS.TOAST_DURATION
      });
    }
  }, [fabricCanvasRef, setLineThickness]);

  /**
   * Handle line color changes
   * @param color - New line color value
   */
  const handleLineColorChange = useCallback((color: string) => {
    setLineColor(color);
    
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = color;
      toast.success(UI_MESSAGES.COLOR_UPDATED, {
        duration: LINE_SETTINGS_CONSTANTS.TOAST_DURATION
      });
    }
  }, [fabricCanvasRef, setLineColor]);

  /**
   * Apply line settings to the canvas brush
   */
  const applyLineSettings = useCallback(() => {
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.width = lineThickness;
      fabricCanvasRef.current.freeDrawingBrush.color = lineColor;
      
      // Track baseline thickness when applying settings
      trackLineThickness(fabricCanvasRef.current, lineThickness);
    }
  }, [fabricCanvasRef, lineThickness, lineColor]);

  return {
    handleLineThicknessChange,
    handleLineColorChange,
    applyLineSettings
  };
};
