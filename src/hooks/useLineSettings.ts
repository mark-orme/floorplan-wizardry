
/**
 * Custom hook for managing line settings
 * @module useLineSettings
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { trackLineThickness } from "@/utils/fabricBrush";

/**
 * UI Messages
 */
const UI_MESSAGES = {
  LINE_THICKNESS_UPDATED: "Line thickness updated to",
  COLOR_UPDATED: "Line color updated"
};

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

/**
 * Props for useLineSettings hook
 * @interface UseLineSettingsProps
 */
interface UseLineSettingsProps {
  /** Reference to Fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current line thickness */
  lineThickness: number;
  /** Current line color */
  lineColor: string;
  /** Function to set line thickness */
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  /** Function to set line color */
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Result of useLineSettings hook
 * @interface UseLineSettingsResult
 */
interface UseLineSettingsResult {
  /** Handle line thickness changes */
  handleLineThicknessChange: (thickness: number) => void;
  /** Handle line color changes */
  handleLineColorChange: (color: string) => void;
  /** Apply current line settings to canvas */
  applyLineSettings: () => void;
}

/**
 * Hook for managing line thickness and color settings
 * @param {UseLineSettingsProps} props - Hook properties
 * @returns {UseLineSettingsResult} Line settings handlers
 */
export const useLineSettings = ({
  fabricCanvasRef,
  lineThickness,
  lineColor,
  setLineThickness,
  setLineColor
}: UseLineSettingsProps): UseLineSettingsResult => {
  
  /**
   * Handle line thickness changes
   * @param thickness - New line thickness value
   */
  const handleLineThicknessChange = useCallback((thickness: number): void => {
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
  const handleLineColorChange = useCallback((color: string): void => {
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
  const applyLineSettings = useCallback((): void => {
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
