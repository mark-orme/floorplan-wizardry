
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
      
      // Always apply grid snapping to all points for consistency
      let finalPoints = snapToGrid(points);
      console.log("Points snapped to grid");
      
      // Apply straightening based on tool
      if (tool === 'straightLine' || tool === 'draw') {
        // Always straighten lines with the wall tool, and optionally for freehand drawing
        // For freehand drawing, simplify to just start and end points if it's a mostly straight line
        if (tool === 'draw' && points.length > 5) {
          // For freehand, only straighten if it looks like a single stroke in mostly one direction
          const start = finalPoints[0];
          const end = finalPoints[finalPoints.length - 1];
          
          // Calculate overall direction and check if it's mostly linear
          const dx = Math.abs(end.x - start.x);
          const dy = Math.abs(end.y - start.y);
          const length = Math.sqrt(dx * dx + dy * dy);
          
          // Check if the path length is similar to the direct distance between endpoints
          // If so, it's mostly a straight line and should be straightened
          const totalSegmentLength = calculatePathLength(finalPoints);
          
          // If path length is within 30% of direct distance, it's likely meant to be straight
          if (totalSegmentLength <= length * 1.3) {
            finalPoints = straightenStroke([start, end]);
            console.log("Applied straightening to freehand drawing");
          }
        } else {
          // For wall tool, always straighten
          finalPoints = straightenStroke(finalPoints);
          console.log("Applied straightening to wall line");
        }
        
        // For better feedback on the wall tool
        if (finalPoints.length === 2) {
          // Calculate length of the line in meters
          const dx = finalPoints[1].x - finalPoints[0].x;
          const dy = finalPoints[1].y - finalPoints[0].y;
          const lengthInMeters = Math.sqrt(dx * dx + dy * dy);
          
          if (tool === 'straightLine') {
            toast.success(`Wall length: ${lengthInMeters.toFixed(2)}m`);
          } else {
            toast.success(`Line length: ${lengthInMeters.toFixed(2)}m`);
          }
        }
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
        
        // For rooms, apply final straightening to close the shape nicely
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
  
  // Helper function to calculate the total length of a path
  const calculatePathLength = (points: Point[]): number => {
    let totalLength = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i-1].x;
      const dy = points[i].y - points[i-1].y;
      totalLength += Math.sqrt(dx * dx + dy * dy);
    }
    return totalLength;
  };
  
  return { processCreatedPath };
};
