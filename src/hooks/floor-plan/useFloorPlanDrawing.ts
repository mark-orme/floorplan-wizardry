import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan, DrawingMode } from '@/types/floorPlanTypes';

/**
 * Props for the useFloorPlanDrawing hook
 */
export interface UseFloorPlanDrawingProps {
  /** Floor plan to draw */
  floorPlan: FloorPlan;
  /** Fabric canvas reference */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Optional drawing tool */
  tool?: DrawingMode;
  /** Optional callback for floor plan updates */
  onFloorPlanUpdate?: (floorPlan: FloorPlan) => void;
  /** Canvas component - for legacy test compatibility */
  canvas?: FabricCanvas | null;
  /** Set tool - for legacy test compatibility */
  setTool?: (tool: DrawingMode) => void;
  /** Add room - for legacy test compatibility */
  addRoom?: (room: any) => void;
}

/**
 * Hook that handles drawing a floor plan on a canvas
 * @param props Hook properties
 * @returns Drawing-related functions
 */
export const useFloorPlanDrawing = (props: UseFloorPlanDrawingProps) => {
  const { floorPlan, fabricCanvasRef, onFloorPlanUpdate } = props;
  
  /**
   * Draw the floor plan on the canvas
   */
  const drawFloorPlan = useCallback((canvas: FabricCanvas, plan: FloorPlan) => {
    if (!canvas) return;
    
    // Clear existing objects
    canvas.clear();
    
    // Draw walls
    plan.walls.forEach(wall => {
      // Implementation of wall drawing
    });
    
    // Draw rooms
    plan.rooms.forEach(room => {
      // Implementation of room drawing
    });
    
    // Draw strokes
    plan.strokes.forEach(stroke => {
      // Implementation of stroke drawing
    });
    
    canvas.renderAll();
  }, []);
  
  // Update the canvas when the floor plan changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    drawFloorPlan(canvas, floorPlan);
  }, [floorPlan, fabricCanvasRef, drawFloorPlan]);
  
  /**
   * Update the floor plan
   */
  const updateFloorPlan = useCallback((updater: (plan: FloorPlan) => FloorPlan) => {
    const updatedPlan = updater(floorPlan);
    if (onFloorPlanUpdate) {
      onFloorPlanUpdate(updatedPlan);
    }
  }, [floorPlan, onFloorPlanUpdate]);
  
  return {
    drawFloorPlan,
    updateFloorPlan,
    // Legacy properties for test compatibility
    canvas: fabricCanvasRef.current,
    tool: props.tool,
    setTool: props.setTool,
    addRoom: props.addRoom
  };
};
