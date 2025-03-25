
/**
 * Hook for managing canvas drawing state
 * @module useCanvasControllerDrawingState
 */
import { useEffect } from "react";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { DrawingTool } from "@/hooks/useCanvasState";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { FloorPlan } from "@/types/floorPlanTypes";

interface UseCanvasControllerDrawingStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  tool: DrawingTool;
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  lineThickness: number;
  lineColor: string;
}

/**
 * Hook that manages canvas drawing state for the controller
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
  lineColor
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
    lineColor
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
