
// Import necessary modules
import { useCallback, useState, useRef, useEffect } from "react";
import { Canvas as FabricCanvas, Line } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { Point } from "@/types/core/Point";
import { useGridSnapping } from "./canvas/useGridSnapping";

// Define hook props interface
interface UseWallDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  wallColor: string;
  wallThickness: number;
}

/**
 * Custom hook for wall drawing functionality
 */
export const useWallDrawing = ({
  fabricCanvasRef,
  tool,
  wallColor,
  wallThickness
}: UseWallDrawingProps) => {
  // State for drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const startPointRef = useRef<Point | null>(null);
  const currentWallRef = useRef<Line | null>(null);
  
  // Initialize grid snapping
  const { snapPointToGrid, snapEnabled } = useGridSnapping({
    fabricCanvasRef,
    initialSnapEnabled: true
  });
  
  // Custom function to handle point snapping for wall lines
  const snapWallPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return { ...point };
    return snapPointToGrid(point);
  }, [snapEnabled, snapPointToGrid]);
  
  // Effect to initialize or clean up based on tool change
  useEffect(() => {
    // Determine if tool is active
    const isWallTool = tool === DrawingMode.WALL;
    
    // Clean up any active drawing when tool changes
    if (!isWallTool && isDrawing) {
      // Cancel drawing logic here
      setIsDrawing(false);
      startPointRef.current = null;
      
      if (currentWallRef.current && fabricCanvasRef.current) {
        fabricCanvasRef.current.remove(currentWallRef.current);
        currentWallRef.current = null;
      }
    }
  }, [tool, isDrawing, fabricCanvasRef]);
  
  /**
   * Handler for starting a wall drawing
   */
  const handleWallStart = useCallback((point: Point) => {
    if (tool !== DrawingMode.WALL || !fabricCanvasRef.current) return;
    
    // Snap the start point to grid if enabled
    const snappedPoint = snapWallPointToGrid(point);
    startPointRef.current = snappedPoint;
    setIsDrawing(true);
    
    // Create initial wall line
    const newWall = new Line([
      snappedPoint.x, snappedPoint.y, 
      snappedPoint.x, snappedPoint.y
    ], {
      stroke: wallColor,
      strokeWidth: wallThickness,
      selectable: true,
      objectType: 'wall'
    });
    
    fabricCanvasRef.current.add(newWall);
    currentWallRef.current = newWall;
    
  }, [tool, fabricCanvasRef, wallColor, wallThickness, snapWallPointToGrid]);
  
  /**
   * Handler for updating a wall while drawing
   */
  const handleWallUpdate = useCallback((point: Point) => {
    if (!isDrawing || !startPointRef.current || !currentWallRef.current || !fabricCanvasRef.current) return;
    
    // Snap the end point to grid if enabled
    const snappedPoint = snapWallPointToGrid(point);
    
    // Update the current wall line
    currentWallRef.current.set({
      x2: snappedPoint.x,
      y2: snappedPoint.y
    });
    
    fabricCanvasRef.current.requestRenderAll();
    
  }, [isDrawing, snapWallPointToGrid, fabricCanvasRef]);
  
  /**
   * Handler for completing a wall drawing
   */
  const handleWallComplete = useCallback(() => {
    if (!isDrawing || !fabricCanvasRef.current) return;
    
    // Reset drawing state
    setIsDrawing(false);
    startPointRef.current = null;
    currentWallRef.current = null;
    
    // Save canvas state for undo/redo
    
  }, [isDrawing, fabricCanvasRef]);
  
  // Set up canvas event handlers
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || tool !== DrawingMode.WALL) return;
    
    // Mouse down handler
    const handleMouseDown = (e: any) => {
      if (e.target) return; // Skip if clicking on an object
      
      const pointer = canvas.getPointer(e);
      handleWallStart({ x: pointer.x, y: pointer.y });
    };
    
    // Mouse move handler
    const handleMouseMove = (e: any) => {
      if (!isDrawing) return;
      
      const pointer = canvas.getPointer(e);
      handleWallUpdate({ x: pointer.x, y: pointer.y });
    };
    
    // Mouse up handler
    const handleMouseUp = () => {
      if (isDrawing) {
        handleWallComplete();
      }
    };
    
    // Add event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    
    // Clean up
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
    
  }, [tool, isDrawing, fabricCanvasRef, handleWallStart, handleWallUpdate, handleWallComplete]);
  
  return {
    isDrawing,
    currentWall: currentWallRef.current
  };
};
