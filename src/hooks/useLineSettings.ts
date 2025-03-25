/**
 * Custom hook for managing line settings
 * @module useLineSettings
 */
import { useCallback } from "react";
import { toast } from "sonner";
import { trackLineThickness } from "@/utils/fabricBrush";

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
      
      toast.success(`Line thickness set to ${thickness}px`);
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
      toast.success(`Line color updated`);
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
    handleLineColorChange: useCallback((color: string) => {
      setLineColor(color);
      
      if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
        fabricCanvasRef.current.freeDrawingBrush.color = color;
        toast.success(`Line color updated`);
      }
    }, [fabricCanvasRef, setLineColor]),
    applyLineSettings
  };
};
