/**
 * Custom hook for processing Fabric.js paths into polylines
 * @module usePathProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Path, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { MAX_OBJECTS_PER_CANVAS } from "@/utils/drawing";
import { DrawingTool } from "./useCanvasState";
import { fabricPathToPoints } from "@/utils/fabricPathUtils";
import { usePointProcessing } from "./usePointProcessing";
import { usePolylineCreation } from "./usePolylineCreation";

interface UsePathProcessingProps {
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

/**
 * Hook for handling path creation and processing
 * @param {UsePathProcessingProps} props - Hook properties
 * @returns {Function} Path creation handler
 */
export const usePathProcessing = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  tool,
  currentFloor,
  setFloorPlans,
  setGia,
  lineThickness = 2,
  lineColor = "#000000"
}: UsePathProcessingProps) => {
  
  // Use the point processing hook
  const { processPoints, convertToPixelPoints, isShapeClosed } = usePointProcessing(tool);
  
  // Use the polyline creation hook
  const { createPolyline } = usePolylineCreation({
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
  
  /**
   * Process a newly created path and convert it to appropriate shapes
   * @param {Path} path - The fabric.js path object
   */
  const processCreatedPath = useCallback((path: Path) => {
    console.log("Path created event triggered");
    
    if (!fabricCanvasRef.current) return;
    const fabricCanvas = fabricCanvasRef.current;
    
    if (!path.path) {
      console.error("Invalid path object:", path);
      return;
    }
    
    try {
      // Check for too many objects on canvas (performance optimization)
      const currentObjects = fabricCanvas.getObjects().filter(obj => 
        obj.type === 'polyline' || obj.type === 'path'
      );
      
      if (currentObjects.length > MAX_OBJECTS_PER_CANVAS) {
        toast.warning(`Maximum objects reached (${MAX_OBJECTS_PER_CANVAS}). Please save or clear some objects.`);
        fabricCanvas.remove(path);
        return;
      }
      
      // Extract points from path
      const points = fabricPathToPoints(path.path);
      console.log("Points extracted from path:", points.length);
      
      if (points.length < 2) {
        console.error("Not enough points to create a path");
        fabricCanvas.remove(path);
        return;
      }
      
      // Process the points according to the current tool
      const finalPoints = processPoints(points);
      
      // Check if the shape is closed (first and last points are very close)
      const isEnclosed = isShapeClosed(finalPoints);
      
      // Convert meter coordinates to pixel coordinates for display
      const pixelPoints = convertToPixelPoints(finalPoints);
      
      console.log("Creating polyline with points:", pixelPoints.length, isEnclosed ? "(enclosed shape)" : "");
      
      // Remove the temporary path before creating the polyline
      fabricCanvas.remove(path);
      
      // Create the polyline from the processed points, passing the isEnclosed flag
      const success = createPolyline(finalPoints, pixelPoints, isEnclosed);
      
      if (success) {
        console.log("Line drawn and added to canvas successfully");
        // History is now handled in useCanvasDrawing to avoid duplicating entries
      }
      
    } catch (error) {
      console.error("Error processing drawing:", error);
      toast.error("Failed to process drawing");
      
      // Safety cleanup if there was an error
      if (fabricCanvasRef.current && path) {
        try {
          fabricCanvasRef.current.remove(path);
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    }
  }, [fabricCanvasRef, processPoints, convertToPixelPoints, isShapeClosed, createPolyline]);
  
  return { processCreatedPath };
};
