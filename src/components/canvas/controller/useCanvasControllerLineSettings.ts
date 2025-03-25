
/**
 * Hook for managing line settings in the canvas controller
 * @module useCanvasControllerLineSettings
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useLineSettings } from "@/hooks/useLineSettings";
import { DrawingTool } from "@/hooks/useCanvasState";

/**
 * Props interface for useCanvasControllerLineSettings hook
 * @interface UseCanvasControllerLineSettingsProps
 */
interface UseCanvasControllerLineSettingsProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Current line thickness setting */
  lineThickness: number;
  /** Current line color setting */
  lineColor: string;
  /** Function to set line thickness */
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  /** Function to set line color */
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
  /** Current active drawing tool */
  tool: DrawingTool;
}

/**
 * Hook that manages line settings in the canvas controller
 * @param {UseCanvasControllerLineSettingsProps} props - Hook properties
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
