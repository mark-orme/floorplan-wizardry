
/**
 * Hook for managing brush settings
 * Provides reactive brush configuration for fabric canvas
 * @module useBrushSettings
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { BaseEventHandlerProps } from "./types";

/**
 * Properties required by the useBrushSettings hook
 * @interface UseBrushSettingsProps
 * @extends BaseEventHandlerProps
 */
interface UseBrushSettingsProps extends BaseEventHandlerProps {
  /** Current line color for the brush */
  lineColor: string;
  /** Current line thickness for the brush in pixels */
  lineThickness: number;
}

/**
 * Hook to manage brush settings for the Fabric canvas
 * Synchronizes brush properties with component state
 * 
 * @param {UseBrushSettingsProps} props - Hook properties
 * 
 * @example
 * const { fabricCanvasRef } = useCanvasInitialization();
 * useBrushSettings({
 *   fabricCanvasRef,
 *   tool: 'brush',
 *   lineColor: '#ff0000',
 *   lineThickness: 3
 * });
 */
export const useBrushSettings = ({
  fabricCanvasRef,
  lineColor,
  lineThickness
}: UseBrushSettingsProps) => {
  useEffect(() => {
    /**
     * Updates the canvas brush settings whenever they change
     * Sets color and thickness on the freeDrawingBrush object
     */
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      fabricCanvas.freeDrawingBrush.color = lineColor;
    }
    
  }, [fabricCanvasRef, lineColor, lineThickness]);
};
