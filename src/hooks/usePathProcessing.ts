
/**
 * Custom hook for processing Fabric.js paths into polylines
 * @module usePathProcessing
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Path, Polyline } from "fabric";
import { toast } from "sonner";
import { 
  PIXELS_PER_METER,
  type FloorPlan,
  type Point
} from "@/utils/drawing";
import { 
  snapToGrid, 
  snapPointsToGrid,
  straightenStroke, 
  calculateGIA,
  filterRedundantPoints 
} from "@/utils/geometry";
import { DrawingTool } from "./useCanvasState";

interface UsePathProcessingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  tool: DrawingTool;
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  lineThickness?: number;
  lineColor?: string;
}

const MAX_OBJECTS_PER_CANVAS = 1000;

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
      const points = fabricPathToPoints(path);
      console.log("Points extracted from path:", points.length);
      
      if (points.length < 2) {
        console.error("Not enough points to create a path");
        fabricCanvas.remove(path);
        return;
      }
      
      // Filter out redundant points that are too close together
      let filteredPoints = filterRedundantPoints(points, 0.05);
      
      // If we have too few points after filtering, use original points
      if (filteredPoints.length < 2) {
        filteredPoints = points;
      }
      
      // Apply grid snapping based on the tool
      // For wall tool (straightLine), use strict grid snapping
      // For other tools, use standard snapping
      let finalPoints = tool === 'straightLine' 
        ? snapPointsToGrid(filteredPoints, true) // Strict grid snapping for walls
        : snapToGrid(filteredPoints);           // Regular snapping for other tools
      
      console.log("Points snapped to grid:", finalPoints.length);
      
      // Apply straightening based on tool
      if (tool === 'straightLine') {
        // For wall tool, always straighten
        finalPoints = straightenStroke([finalPoints[0], finalPoints[finalPoints.length - 1]]);
        console.log("Applied straightening to wall line");
        
        // Calculate and display wall length
        const dx = finalPoints[1].x - finalPoints[0].x;
        const dy = finalPoints[1].y - finalPoints[0].y;
        const lengthInMeters = Math.sqrt(dx * dx + dy * dy);
        toast.success(`Wall length: ${lengthInMeters.toFixed(2)}m`);
      } else if (tool === 'room') {
        // For room tool, create enclosed shape with straightening between points
        const snappedPoints = [finalPoints[0]];
        
        for (let i = 1; i < finalPoints.length; i++) {
          const prevPoint = snappedPoints[i-1];
          const currentPoint = finalPoints[i];
          
          // Apply straightening between consecutive points
          const straightened = straightenStroke([prevPoint, currentPoint]);
          if (straightened.length > 1) {
            snappedPoints.push(straightened[1]);
          }
        }
        
        // For rooms, apply final straightening to close the shape nicely
        if (snappedPoints.length > 2) {
          const firstPoint = snappedPoints[0];
          const lastPoint = snappedPoints[snappedPoints.length - 1];
          
          // Apply straightening for the closing segment
          const closingSegment = straightenStroke([lastPoint, firstPoint]);
          
          // Replace last point with properly straightened closing point
          if (closingSegment.length > 1 && 
              (Math.abs(closingSegment[1].x - firstPoint.x) < 0.1 && 
               Math.abs(closingSegment[1].y - firstPoint.y) < 0.1)) {
            // If very close to first point, use exactly the first point to ensure perfect closing
            snappedPoints[snappedPoints.length - 1] = {...firstPoint};
          }
        }
        
        finalPoints = snappedPoints;
        console.log("Applied straightening to room");
      }

      // Make sure we still have at least 2 points after all processing
      if (finalPoints.length < 2) {
        console.error("Not enough points after processing");
        fabricCanvas.remove(path);
        return;
      }

      // Convert meter coordinates to pixel coordinates for display
      const pixelPoints = finalPoints.map(p => ({ 
        x: p.x * PIXELS_PER_METER, 
        y: p.y * PIXELS_PER_METER 
      }));

      console.log("Creating polyline with points:", pixelPoints.length);

      // Create a polyline from the processed points
      const polylineOptions = {
        stroke: lineColor,
        strokeWidth: lineThickness,
        fill: tool === 'room' ? `${lineColor}20` : 'transparent', // Semi-transparent fill for rooms
        objectType: tool === 'room' ? 'room' : 'line',
        objectCaching: true,
        perPixelTargetFind: false,
        selectable: false,
        hoverCursor: 'default'
      };

      try {
        // Remove the temporary path before creating the polyline
        fabricCanvas.remove(path);
        
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
        // Changed renderAll to requestRenderAll for Fabric.js v6 compatibility
        fabricCanvas.requestRenderAll();
      } catch (err) {
        console.error("Error creating polyline:", err);
        toast.error("Failed to create line");
        return;
      }
      
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
      
      console.log("Adding to history:", currentState.length, "objects");
      historyRef.current.past.push([...currentState]);
      historyRef.current.future = [];
      
      console.log("Line drawn and added to canvas successfully");
      
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
  }, [fabricCanvasRef, gridLayerRef, historyRef, tool, currentFloor, setFloorPlans, setGia, lineThickness, lineColor]);
  
  // Helper function to extract points from a Fabric.js path
  const fabricPathToPoints = (path: Path): Point[] => {
    if (!path.path) return [];
    
    const points: Point[] = [];
    const pathData = path.path;
    
    // Extract points from the path data
    // Each path command is an array where the first element is the command type
    for (let i = 0; i < pathData.length; i++) {
      const [command, ...coords] = pathData[i];
      
      // For 'M' (move to) and 'L' (line to) commands, add the point
      if (command === 'M' || command === 'L') {
        points.push({
          x: coords[0] / PIXELS_PER_METER, // Convert pixels to meters
          y: coords[1] / PIXELS_PER_METER
        });
      }
      // For 'Q' (quadratic curve) commands, add the control point and end point
      else if (command === 'Q') {
        // The end point of a quadratic curve (coords[2], coords[3])
        points.push({
          x: coords[2] / PIXELS_PER_METER,
          y: coords[3] / PIXELS_PER_METER
        });
      }
    }
    
    return points;
  };
  
  return { processCreatedPath };
};
