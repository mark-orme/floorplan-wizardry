
/**
 * Hook for floor plan drawing functionality
 * @module hooks/useFloorPlanDrawing
 */
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan, Stroke, Room, Wall, asStrokeType, asRoomType } from '@/types/floor-plan/unifiedTypes';
import { DrawingMode } from '@/constants/drawingModes';
import { calculateWallLength } from '@/utils/debug/typeDiagnostics';

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
  tool: DrawingMode;  // For test compatibility
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>;  // For test compatibility
  addStroke: (stroke: Stroke) => void;
  addRoom: (room: Room) => void;  // For test compatibility
  addWall: (wall: Omit<Wall, 'length'>) => void;
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
    
    // Add the stroke to the canvas
    currentCanvas.add(/* stroke visual representation */);
    currentCanvas.renderAll();
    
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
  }, [getCanvas, floorPlan, onFloorPlanUpdate, setFloorPlan]);

  // Add a room to the floor plan
  const addRoom = useCallback((room: Room) => {
    const currentCanvas = getCanvas();
    if (!currentCanvas) return;
    
    // Ensure room has proper type
    const validatedRoom = {
      ...room,
      type: asRoomType(room.type)
    };
    
    // Add the room to the canvas
    currentCanvas.add(/* room visual representation */);
    currentCanvas.renderAll();
    
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
  }, [getCanvas, floorPlan, onFloorPlanUpdate, setFloorPlan]);

  // Add a wall to the floor plan
  const addWall = useCallback((wall: Omit<Wall, 'length'>) => {
    const currentCanvas = getCanvas();
    if (!currentCanvas) return;
    
    // Calculate length for the wall
    const completeWall: Wall = {
      ...wall,
      length: calculateWallLength(wall.start, wall.end)
    };
    
    // Add the wall to the canvas
    currentCanvas.add(/* wall visual representation */);
    currentCanvas.renderAll();
    
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
  }, [getCanvas, floorPlan, onFloorPlanUpdate, setFloorPlan]);

  return {
    isDrawing,
    setIsDrawing,
    tool: currentTool,  // For test compatibility
    setTool,  // For test compatibility
    addStroke,
    addRoom,  // For test compatibility
    addWall
  };
};
