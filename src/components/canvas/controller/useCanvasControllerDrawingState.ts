
/**
 * Hook for managing canvas drawing state
 * @module useCanvasControllerDrawingState
 */
import { useEffect } from "react";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { DrawingTool } from "@/hooks/useCanvasState";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Props interface for useCanvasControllerDrawingState hook
 * @interface UseCanvasControllerDrawingStateProps
 */
interface UseCanvasControllerDrawingStateProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Reference to history state for undo/redo */
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Index of current floor */
  currentFloor: number;
  /** Function to update floor plans */
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Function to set the GIA (Gross Internal Area) */
  setGia: React.Dispatch<React.SetStateAction<number>>;
  /** Current line thickness setting */
  lineThickness: number;
  /** Current line color setting */
  lineColor: string;
  /** Function to delete selected objects */
  deleteSelectedObjects?: () => void;
}

/**
 * Hook that manages canvas drawing state for the controller
 * @param {UseCanvasControllerDrawingStateProps} props - Hook properties
 * @returns Drawing state and related functions
 */
export const useCanvasControllerDrawingState = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  tool,
  currentFloor,
  setFloorPlans,
  setGia,
  lineThickness,
  lineColor,
  deleteSelectedObjects
}: UseCanvasControllerDrawingStateProps) => {
  // Use the drawing hook to get drawing state
  const { drawingState } = useCanvasDrawing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor,
    deleteSelectedObjects
  });
  
  // Enhanced drawing state visualization for select tool
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Customize selection appearance for edit mode
    if (tool === "select") {
      // Set selection style
      canvas.selectionColor = 'rgba(100, 100, 255, 0.1)';
      canvas.selectionBorderColor = 'rgba(100, 100, 255, 0.8)';
      canvas.selectionLineWidth = 1;
      
      // Enable measurements for selected objects
      canvas.on('selection:created', (e) => {
        if (e.selected && e.selected.length === 1) {
          const obj = e.selected[0];
          // Show measurement info for the selected wall
          if ((obj as any).objectType === 'line' || obj.type === 'polyline') {
            // Trigger measurement display logic here
            canvas.fire('measurement:show', { target: obj });
          }
        }
      });
      
      canvas.on('selection:cleared', () => {
        // Hide measurement info
        canvas.fire('measurement:hide', {});
      });
    }
    
    return () => {
      canvas.off('selection:created');
      canvas.off('selection:cleared');
    };
  }, [fabricCanvasRef, tool]);
  
  return {
    drawingState
  };
};
