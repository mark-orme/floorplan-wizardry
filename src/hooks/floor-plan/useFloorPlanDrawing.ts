/**
 * Hook for floor plan drawing functionality
 * @module hooks/floor-plan/useFloorPlanDrawing
 */
import { useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan, Stroke, Room, Wall, asStrokeType, asRoomType } from '@/types/floor-plan/unifiedTypes';
import { DrawingMode } from '@/constants/drawingModes';

export interface UseFloorPlanDrawingProps {
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
  canvas?: FabricCanvas;  // For test compatibility
  floorPlan: FloorPlan;
  onFloorPlanUpdate?: (floorPlan: FloorPlan) => void;
  tool?: DrawingMode;
  setFloorPlan?: React.Dispatch<React.SetStateAction<FloorPlan>>;  // For test compatibility
}

export interface UseFloorPlanDrawingResult {
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  tool: DrawingMode;
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>;
  addStroke: (stroke: Stroke) => void;
  addRoom: (room: Room) => void;
  addWall: (wall: Omit<Wall, 'length'>) => void;
  drawFloorPlan: (canvas: FabricCanvas, floorPlan: FloorPlan) => void;
}

export const useFloorPlanDrawing = ({ 
  fabricCanvasRef,
  canvas,  // For test compatibility
  floorPlan,
  onFloorPlanUpdate,
  tool = DrawingMode.SELECT,
  setFloorPlan  // For test compatibility
}: UseFloorPlanDrawingProps): UseFloorPlanDrawingResult => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setTool] = useState<DrawingMode>(tool);
  
  // Use either fabricCanvasRef or canvas directly
  const getCanvas = () => {
    if (canvas) return canvas;
    if (fabricCanvasRef?.current) return fabricCanvasRef.current;
    return null;
  };

  // Add a stroke to the floor plan
  const addStroke = useCallback((stroke: Stroke) => {
    const currentCanvas = getCanvas();
    if (!currentCanvas) return;
    
    // Ensure stroke has proper type
    const validatedStroke = {
      ...stroke,
      type: asStrokeType(stroke.type)
    };
    
    // Update the floor plan data
    const updatedFloorPlan = {
      ...floorPlan,
      strokes: [...floorPlan.strokes, validatedStroke],
      updatedAt: new Date().toISOString()
    };
    
    // Notify parent if callback exists
    if (onFloorPlanUpdate) {
      onFloorPlanUpdate(updatedFloorPlan);
    }
    
    // Support for the test API
    if (setFloorPlan) {
      setFloorPlan(updatedFloorPlan);
    }
  }, [floorPlan, onFloorPlanUpdate, getCanvas, setFloorPlan]);

  // Add a room to the floor plan
  const addRoom = useCallback((room: Room) => {
    const currentCanvas = getCanvas();
    if (!currentCanvas) return;
    
    // Ensure room has proper type
    const validatedRoom = {
      ...room,
      type: asRoomType(room.type)
    };
    
    // Update the floor plan data
    const updatedFloorPlan = {
      ...floorPlan,
      rooms: [...floorPlan.rooms, validatedRoom],
      updatedAt: new Date().toISOString()
    };
    
    // Notify parent if callback exists
    if (onFloorPlanUpdate) {
      onFloorPlanUpdate(updatedFloorPlan);
    }
    
    // Support for the test API
    if (setFloorPlan) {
      setFloorPlan(updatedFloorPlan);
    }
  }, [floorPlan, onFloorPlanUpdate, getCanvas, setFloorPlan]);

  // Add a wall to the floor plan
  const addWall = useCallback((wall: Omit<Wall, 'length'>) => {
    const currentCanvas = getCanvas();
    if (!currentCanvas) return;
    
    // Calculate wall length
    const start = wall.start;
    const end = wall.end;
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Create complete wall object
    const completeWall: Wall = {
      ...wall,
      length,
      angle,
      roomIds: wall.roomIds || []
    };
    
    // Update the floor plan data
    const updatedFloorPlan = {
      ...floorPlan,
      walls: [...floorPlan.walls, completeWall],
      updatedAt: new Date().toISOString()
    };
    
    // Notify parent if callback exists
    if (onFloorPlanUpdate) {
      onFloorPlanUpdate(updatedFloorPlan);
    }
    
    // Support for the test API
    if (setFloorPlan) {
      setFloorPlan(updatedFloorPlan);
    }
  }, [floorPlan, onFloorPlanUpdate, getCanvas, setFloorPlan]);

  // Draw a floor plan on the canvas
  const drawFloorPlan = useCallback((canvas: FabricCanvas, floorPlan: FloorPlan) => {
    if (!canvas) return;
    
    // Clear existing objects
    canvas.clear();
    
    // Draw walls
    floorPlan.walls.forEach(wall => {
      // Draw wall representation
      // (Implementation would depend on your drawing logic)
    });
    
    // Draw rooms
    floorPlan.rooms.forEach(room => {
      // Draw room representation
      // (Implementation would depend on your drawing logic)
    });
    
    // Draw strokes
    floorPlan.strokes.forEach(stroke => {
      // Draw stroke representation
      // (Implementation would depend on your drawing logic)
    });
    
    // Render the canvas
    canvas.renderAll();
  }, []);

  // Keep tool state in sync with props
  useEffect(() => {
    setTool(tool);
  }, [tool]);

  // Return the hook API
  return {
    isDrawing,
    setIsDrawing,
    tool: currentTool,
    setTool,
    addStroke,
    addRoom,
    addWall,
    drawFloorPlan
  };
};
