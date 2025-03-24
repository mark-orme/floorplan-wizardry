
/**
 * Custom hook for processing Fabric.js paths into polylines
 * @module usePathProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Path, Polyline } from "fabric";
import { toast } from "sonner";
import { 
  PIXELS_PER_METER,
  fabricPathToPoints, 
  snapToGrid, 
  straightenStroke,
  calculateGIA, 
  type FloorPlan,
  type Point,
  MAX_OBJECTS_PER_CANVAS
} from "@/utils/drawing";
import { snapToAngle } from "@/utils/fabric";
import { DrawingTool } from "./useCanvasState";

interface UsePathProcessingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  tool: DrawingTool;
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
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
  setGia
}: UsePathProcessingProps) => {
  
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
      
      // Extract points from path with full precision
      const points = fabricPathToPoints(path.path);
      console.log("Points extracted from path:", points.length);
      
      if (points.length < 2) {
        console.error("Not enough points to create a path");
        return;
      }
      
      // Apply grid snapping to all points
      let finalPoints = snapToGrid(points);
      
      // Apply straightening based on tool
      if (tool === 'straightLine') {
        finalPoints = straightenStroke(finalPoints);
        console.log("Applied straightening to line");
      } else if (tool === 'room') {
        // For room tool, create enclosed shape with angle snapping
        const snappedPoints = [finalPoints[0]];
        
        for (let i = 1; i < finalPoints.length; i++) {
          const prevPoint = snappedPoints[i-1];
          const currentPoint = finalPoints[i];
          
          // Use angle snapping between consecutive points
          const snappedEnd = snapToAngle(prevPoint, currentPoint);
          snappedPoints.push(snappedEnd);
        }
        
        // For rooms, apply final straightening to close the shape
        if (snappedPoints.length > 2) {
          const firstPoint = snappedPoints[0];
          const lastPoint = snappedPoints[snappedPoints.length - 1];
          const closingPoint = snapToAngle(lastPoint, firstPoint);
          
          // Replace last point with properly snapped closing point
          if (snappedPoints.length > 2 && 
              (Math.abs(closingPoint.x - firstPoint.x) < 0.1 && 
               Math.abs(closingPoint.y - firstPoint.y) < 0.1)) {
            // If very close to first point, use exactly the first point to ensure perfect closing
            snappedPoints[snappedPoints.length - 1] = {...firstPoint};
          }
        }
        
        finalPoints = snappedPoints;
        console.log("Applied angle snapping to room");
      }

      // Convert meter coordinates to pixel coordinates for display
      const pixelPoints = finalPoints.map(p => ({ 
        x: p.x * PIXELS_PER_METER, 
        y: p.y * PIXELS_PER_METER 
      }));

      // Create a polyline from the processed points
      const polyline = new Polyline(pixelPoints, {
        stroke: '#000000',
        strokeWidth: 2,
        fill: tool === 'room' ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
        objectType: tool === 'room' ? 'room' : 'line',
        objectCaching: true,
        perPixelTargetFind: false
      });

      // Replace the temporary path with the processed polyline
      fabricCanvas.remove(path);
      fabricCanvas.add(polyline);
      
      // Ensure grid stays in the background
      gridLayerRef.current.forEach(gridObj => {
        if (fabricCanvas.contains(gridObj)) {
          fabricCanvas.sendObjectToBack(gridObj);
        }
      });
      
      // Update floor plans data
      setFloorPlans(prev => {
        const newFloorPlans = [...prev];
        if (newFloorPlans[currentFloor]) {
          newFloorPlans[currentFloor] = {
            ...newFloorPlans[currentFloor],
            strokes: [...newFloorPlans[currentFloor].strokes, finalPoints]
          };
          
          // Calculate and update area for room shapes
          if (tool === 'room' && finalPoints.length > 2) {
            const area = calculateGIA(finalPoints);
            setGia(prev => prev + area);
            toast.success(`Room added: ${area.toFixed(2)} m²`);
          }
        }
        return newFloorPlans;
      });

      // Update history for undo/redo
      const currentState = fabricCanvas.getObjects().filter(obj => 
        obj.type === 'polyline' || obj.type === 'path'
      );
      historyRef.current.past.push([...currentState]);
      historyRef.current.future = [];
      
    } catch (error) {
      console.error("Error processing drawing:", error);
      toast.error("Failed to process drawing");
    }
  }, [fabricCanvasRef, gridLayerRef, historyRef, tool, currentFloor, setFloorPlans, setGia]);
  
  return { processCreatedPath };
};
