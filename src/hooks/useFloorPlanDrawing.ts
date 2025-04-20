
/**
 * Hook for floor plan drawing functionality
 * @module hooks/useFloorPlanDrawing
 */
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan, Stroke, Room, Wall, asStrokeType, asRoomType } from '@/types/floor-plan/unifiedTypes';
import { DrawingMode } from '@/constants/drawingModes';

export interface UseFloorPlanDrawingProps {
  canvas: FabricCanvas;
  floorPlan: FloorPlan;
  onFloorPlanUpdate?: (floorPlan: FloorPlan) => void;
  tool?: DrawingMode;
}

export const useFloorPlanDrawing = ({ 
  canvas, 
  floorPlan,
  onFloorPlanUpdate,
  tool = DrawingMode.SELECT
}: UseFloorPlanDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setTool] = useState<DrawingMode>(tool);

  // Add a stroke to the floor plan
  const addStroke = useCallback((stroke: Stroke) => {
    if (!canvas) return;
    
    // Ensure stroke has proper type
    const validatedStroke = {
      ...stroke,
      type: asStrokeType(stroke.type)
    };
    
    // Add the stroke to the canvas
    // (Implementation would add visual representation to canvas)
    canvas.add(/* stroke visual representation */);
    canvas.renderAll();
    
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
  }, [canvas, floorPlan, onFloorPlanUpdate]);

  // Add a room to the floor plan
  const addRoom = useCallback((room: Room) => {
    if (!canvas) return;
    
    // Ensure room has proper type
    const validatedRoom = {
      ...room,
      type: asRoomType(room.type)
    };
    
    // Add the room to the canvas
    // (Implementation would add visual representation to canvas)
    canvas.add(/* room visual representation */);
    canvas.renderAll();
    
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
  }, [canvas, floorPlan, onFloorPlanUpdate]);

  // Add a wall to the floor plan
  const addWall = useCallback((wall: Wall) => {
    if (!canvas) return;
    
    // Add the wall to the canvas
    // (Implementation would add visual representation to canvas)
    canvas.add(/* wall visual representation */);
    canvas.renderAll();
    
    // Update the floor plan data
    const updatedFloorPlan = {
      ...floorPlan,
      walls: [...floorPlan.walls, wall],
      updatedAt: new Date().toISOString()
    };
    
    // Notify parent if callback exists
    if (onFloorPlanUpdate) {
      onFloorPlanUpdate(updatedFloorPlan);
    }
  }, [canvas, floorPlan, onFloorPlanUpdate]);

  return {
    isDrawing,
    setIsDrawing,
    tool: currentTool,
    setTool,
    addStroke,
    addRoom,
    addWall
  };
};
