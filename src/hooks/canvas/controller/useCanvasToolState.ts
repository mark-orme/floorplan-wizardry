
/**
 * Hook for managing canvas tool state
 * Handles tool selection and state changes
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";

/**
 * Props for useCanvasToolState hook
 */
interface UseCanvasToolStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>;
  lineThickness: number;
  lineColor: string;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook that manages canvas tool state and changes
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
   * Handle tool change
   */
  const handleToolChange = useCallback((newTool: DrawingMode): void => {
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
    
    toast.success(`Tool changed to ${newTool}`);
  }, [fabricCanvasRef, lineThickness, lineColor, setTool]);
  
  /**
   * Handle zoom change
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
    handleZoom
  };
};
