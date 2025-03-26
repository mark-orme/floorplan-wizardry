
/**
 * Hook for managing line settings in the canvas controller
 * @module useCanvasControllerLineSettings
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingTool } from "@/hooks/useCanvasState";

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
 * @returns Line settings functions
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

  // Handle line thickness change
  const handleLineThicknessChange = useCallback((thickness: number) => {
    setLineThickness(thickness);
    
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.width = thickness;
    }
  }, [fabricCanvasRef, setLineThickness]);

  // Handle line color change
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
