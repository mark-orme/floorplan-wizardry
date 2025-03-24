
/**
 * Custom hook for handling canvas drawing operations
 * Manages drawing events, path creation, and shape processing
 * @module useCanvasDrawing
 */
import { useCallback, useEffect, useState, useRef } from "react";
import { Canvas as FabricCanvas, PencilBrush, Path, Polyline } from "fabric";
import { toast } from "sonner";
import { 
  PIXELS_PER_METER,
  fabricPathToPoints, 
  snapToGrid, 
  straightenStroke,
  calculateGIA, 
  type FloorPlan,
  type Stroke,
  type Point,
  MAX_OBJECTS_PER_CANVAS
} from "@/utils/drawing";
import { snapToAngle } from "@/utils/fabricHelpers";

interface UseCanvasDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  tool: "draw" | "room" | "straightLine";
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook for handling all drawing-related operations on the canvas
 * @param {UseCanvasDrawingProps} props - Hook properties
 * @returns {Object} Drawing state and handlers
 */
export const useCanvasDrawing = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  tool,
  currentFloor,
  setFloorPlans,
  setGia
}: UseCanvasDrawingProps) => {
  // Track drawing state for measurements
  const [drawingState, setDrawingState] = useState({
    isDrawing: false,
    startPoint: null as Point | null,
    currentPoint: null as Point | null,
    cursorPosition: { x: 0, y: 0 }
  });
  
  // Debouncing for performance
  const debounceTimerRef = useRef<number | null>(null);
  
  // Throttle the mouse move updates for better performance
  const throttleRef = useRef<{
    lastCallTime: number;
    timeout: number | null;
  }>({
    lastCallTime: 0,
    timeout: null
  });
  
  /**
   * Handle path creation events from the Fabric.js canvas
   */
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const fabricCanvas = fabricCanvasRef.current;
    
    /**
     * Process a newly created path and convert it to appropriate shapes
     * @param {Object} e - Event object containing the path
     */
    const handlePathCreated = (e: { path: Path }) => {
      console.log("Path created event triggered");
      const path = e.path;
      
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
        
        // Optimization: Use lower precision for points extraction on complex paths
        const points = fabricPathToPoints(path.path);
        console.log("Points extracted from path:", points.length);
        
        if (points.length < 2) {
          console.error("Not enough points to create a path");
          return;
        }
        
        // Performance optimization: Simplify paths with too many points
        let finalPoints;
        if (points.length > 100) {
          // Simple point reduction algorithm for very complex paths
          const simplified = points.filter((_, index) => index % Math.ceil(points.length / 100) === 0);
          finalPoints = snapToGrid(simplified);
        } else {
          finalPoints = snapToGrid(points);
        }
        
        // Process points based on selected tool
        if (tool === 'straightLine') {
          finalPoints = straightenStroke(finalPoints);
        } else if (tool === 'room' && finalPoints.length >= 2) {
          // For room tool, use angle snapping for 45-degree angles
          const snappedPoints = [finalPoints[0]];
          
          for (let i = 1; i < finalPoints.length; i++) {
            const snappedEnd = snapToAngle(finalPoints[i-1], finalPoints[i]);
            snappedPoints.push(snappedEnd);
          }
          finalPoints = snappedPoints;
        }

        // Create a polyline from the processed points
        const polyline = new Polyline(
          finalPoints.map(p => ({ x: p.x * PIXELS_PER_METER, y: p.y * PIXELS_PER_METER })),
          {
            stroke: '#000000',
            strokeWidth: 2,
            fill: tool === 'room' ? 'rgba(0, 0, 255, 0.1)' : 'transparent',
            objectType: tool === 'room' ? 'room' : 'line',
            objectCaching: true, // Enable caching for better performance
            perPixelTargetFind: false // Disable pixel-perfect targeting for better performance
          }
        );

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
        
        // Reset drawing state
        setDrawingState({
          isDrawing: false,
          startPoint: null,
          currentPoint: null,
          cursorPosition: { x: 0, y: 0 }
        });
      } catch (error) {
        console.error("Error processing drawing:", error);
        toast.error("Failed to process drawing");
      }
    };
    
    /**
     * Track mouse down events to capture start point
     */
    const handleMouseDown = (e: any) => {
      if (!fabricCanvas.isDrawingMode) return;
      
      const pointer = fabricCanvas.getPointer(e.e);
      const point = {
        x: pointer.x / PIXELS_PER_METER,
        y: pointer.y / PIXELS_PER_METER
      };
      
      setDrawingState(prev => ({
        ...prev,
        isDrawing: true,
        startPoint: point,
        currentPoint: point,
        cursorPosition: { x: e.e.clientX, y: e.e.clientY }
      }));
    };
    
    /**
     * Track mouse move events to update current point with throttling
     */
    const handleMouseMove = (e: any) => {
      if (!drawingState.isDrawing) return;
      
      // Throttle updates for better performance (update max 30fps)
      const now = Date.now();
      if (now - throttleRef.current.lastCallTime < 33) { // ~30fps
        if (throttleRef.current.timeout === null) {
          throttleRef.current.timeout = window.setTimeout(() => {
            updateDrawingState(e);
            throttleRef.current.timeout = null;
            throttleRef.current.lastCallTime = Date.now();
          }, 33);
        }
        return;
      }
      
      updateDrawingState(e);
      throttleRef.current.lastCallTime = now;
    };
    
    const updateDrawingState = (e: any) => {
      const pointer = fabricCanvas.getPointer(e.e);
      const point = {
        x: pointer.x / PIXELS_PER_METER,
        y: pointer.y / PIXELS_PER_METER
      };
      
      setDrawingState(prev => ({
        ...prev,
        currentPoint: point,
        cursorPosition: { x: e.e.clientX, y: e.e.clientY }
      }));
    };
    
    /**
     * Handle mouse up events to end drawing
     */
    const handleMouseUp = () => {
      if (throttleRef.current.timeout !== null) {
        clearTimeout(throttleRef.current.timeout);
        throttleRef.current.timeout = null;
      }
      
      setDrawingState(prev => ({
        ...prev,
        isDrawing: false
      }));
    };
    
    // Attach event listeners
    fabricCanvas.on('path:created', handlePathCreated);
    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    
    // Clean up event listeners on unmount
    return () => {
      if (throttleRef.current.timeout !== null) {
        clearTimeout(throttleRef.current.timeout);
      }
      
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
      
      fabricCanvas.off('path:created', handlePathCreated);
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
    };
  }, [fabricCanvasRef, gridLayerRef, historyRef, tool, currentFloor, setFloorPlans, setGia, drawingState.isDrawing]);

  return {
    drawingState
  };
};
