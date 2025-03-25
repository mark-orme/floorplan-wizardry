
/**
 * Hook for managing line settings in the canvas controller
 * @module useCanvasControllerLineSettings
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useLineSettings } from "@/hooks/useLineSettings";
import { DrawingTool } from "@/hooks/useCanvasState";

interface UseCanvasControllerLineSettingsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineThickness: number;
  lineColor: string;
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
  tool: DrawingTool;
}

/**
 * Hook that manages line settings in the canvas controller
 * @returns Line settings functions and handlers
 */
export const useCanvasControllerLineSettings = (props: UseCanvasControllerLineSettingsProps) => {
  const {
    fabricCanvasRef,
    lineThickness,
    lineColor,
    setLineThickness,
    setLineColor,
    tool
  } = props;

  // Line settings management
  const { 
    handleLineThicknessChange, 
    handleLineColorChange,
    applyLineSettings
  } = useLineSettings({
    fabricCanvasRef,
    lineThickness,
    lineColor,
    setLineThickness,
    setLineColor
  });

  // Apply line settings when tool changes
  useEffect(() => {
    applyLineSettings();
  }, [tool, applyLineSettings]);

  return {
    handleLineThicknessChange, 
    handleLineColorChange
  };
};
