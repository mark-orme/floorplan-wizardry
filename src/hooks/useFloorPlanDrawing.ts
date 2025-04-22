
/**
 * Hook for floor plan drawing functionality
 * @module hooks/useFloorPlanDrawing
 */
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan, Stroke, Room, Wall, StrokeTypeLiteral, RoomTypeLiteral, createWall } from '@/types/floorPlan';
import { DrawingMode } from '@/constants/drawingModes';

export interface UseFloorPlanDrawingProps {
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
  floorPlan: FloorPlan;
  onFloorPlanUpdate?: (floorPlan: FloorPlan) => void;
}

export interface UseFloorPlanDrawingResult {
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  addStroke: (stroke: Stroke) => void;
  addWall: (wall: Omit<Wall, 'length'>) => void;
  handleDrawingEvent: () => void;
  drawFloorPlan: (canvas: FabricCanvas, floorPlan: FloorPlan) => void;
  saveState: () => void;
  restoreState: () => void;
  snapPoint: (point: any) => any;
  updateObject: (object: any) => void;
  deleteObject: (object: any) => void;
}

export const useFloorPlanDrawing = ({ 
  fabricCanvasRef,
  floorPlan,
  onFloorPlanUpdate
}: UseFloorPlanDrawingProps): UseFloorPlanDrawingResult => {
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Use either fabricCanvasRef directly
  const getCanvas = () => {
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
      type: stroke.type as StrokeTypeLiteral
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
  }, [getCanvas, floorPlan, onFloorPlanUpdate]);

  // Add a wall to the floor plan
  const addWall = useCallback((wallInput: Omit<Wall, 'length'>) => {
    const currentCanvas = getCanvas();
    if (!currentCanvas) return;
    
    // Calculate length for the wall
    const completeWall = createWall(wallInput.start, wallInput.end, wallInput.thickness, wallInput.color);
    
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
  }, [getCanvas, floorPlan, onFloorPlanUpdate]);

  // For compatibility with the expected API
  const handleDrawingEvent = useCallback(() => {
    // Empty implementation for API compatibility
    console.log("Drawing event handled");
  }, []);

  const drawFloorPlan = useCallback((canvas: FabricCanvas, floorPlan: FloorPlan) => {
    // Empty implementation for API compatibility
    console.log("Draw floor plan called");
  }, []);

  const saveState = useCallback(() => {
    // Empty implementation for API compatibility
    console.log("Save state called");
  }, []);

  const restoreState = useCallback(() => {
    // Empty implementation for API compatibility
    console.log("Restore state called");
  }, []);

  const snapPoint = useCallback((point: any) => {
    // Empty implementation for API compatibility
    return point;
  }, []);

  const updateObject = useCallback((object: any) => {
    // Empty implementation for API compatibility
    console.log("Update object called");
  }, []);

  const deleteObject = useCallback((object: any) => {
    // Empty implementation for API compatibility
    console.log("Delete object called");
  }, []);

  return {
    isDrawing,
    setIsDrawing,
    addStroke,
    addWall,
    handleDrawingEvent,
    drawFloorPlan,
    saveState,
    restoreState, 
    snapPoint,
    updateObject,
    deleteObject
  };
};
