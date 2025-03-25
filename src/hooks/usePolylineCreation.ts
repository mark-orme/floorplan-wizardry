
/**
 * Custom hook for creating polylines from processed points
 * @module usePolylineCreation
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Polyline, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { PIXELS_PER_METER, type Point } from "@/utils/drawing";
import { calculateGIA } from "@/utils/geometry";
import { DrawingTool } from "./useCanvasState";

interface UsePolylineCreationProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  tool: DrawingTool;
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<any[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  lineThickness?: number;
  lineColor?: string;
}

export const usePolylineCreation = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  tool,
  currentFloor,
  setFloorPlans,
  setGia,
  lineThickness = 2,
  lineColor = "#000000"
}: UsePolylineCreationProps) => {
  
  /**
   * Create a polyline from processed points and add it to canvas
   */
  const createPolyline = useCallback((
    finalPoints: Point[],
    pixelPoints: Point[],
    isEnclosed: boolean = false
  ) => {
    if (!fabricCanvasRef.current) return false;
    const fabricCanvas = fabricCanvasRef.current;
    
    try {
      // Create a polyline from the processed points
      const polylineOptions = {
        stroke: lineColor,
        strokeWidth: lineThickness,
        fill: isEnclosed ? `${lineColor}20` : 'transparent', // Semi-transparent fill for enclosed shapes
        objectType: isEnclosed ? 'room' : 'line',
        objectCaching: true,
        perPixelTargetFind: false,
        selectable: false,
        hoverCursor: 'default'
      };

      // Create the polyline with pixel points
      const polyline = new Polyline(pixelPoints, polylineOptions);
      
      // Add the processed polyline to canvas
      fabricCanvas.add(polyline);
      
      console.log("Polyline added to canvas successfully");
      
      // Ensure grid stays in the background
      gridLayerRef.current.forEach(gridObj => {
        if (fabricCanvas.contains(gridObj)) {
          fabricCanvas.sendObjectToBack(gridObj);
        }
      });
      
      // Force a render to ensure the polyline is displayed
      fabricCanvas.requestRenderAll();
      
      // Update floor plans data
      setFloorPlans(prev => {
        const newFloorPlans = [...prev];
        if (newFloorPlans[currentFloor]) {
          newFloorPlans[currentFloor] = {
            ...newFloorPlans[currentFloor],
            strokes: [...newFloorPlans[currentFloor].strokes, finalPoints]
          };
          
          // Calculate and update area for enclosed shapes
          if (isEnclosed && finalPoints.length > 2) {
            const area = calculateGIA(finalPoints);
            setGia(prev => prev + area);
            toast.success(`Room shape enclosed: ${area.toFixed(2)} m²`);
          }
        }
        return newFloorPlans;
      });

      // History is now managed in useCanvasDrawing
      return true;
    } catch (err) {
      console.error("Error creating polyline:", err);
      toast.error("Failed to create line");
      return false;
    }
  }, [fabricCanvasRef, gridLayerRef, tool, currentFloor, setFloorPlans, setGia, lineThickness, lineColor]);

  return { createPolyline };
};
