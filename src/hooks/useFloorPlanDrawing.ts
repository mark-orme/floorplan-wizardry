import { useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan } from '@/types/floorPlan';
import { DrawingMode } from '@/constants/drawingModes';
import type { MutableRefObject } from 'react';

export interface UseFloorPlanDrawingProps {
  fabricCanvasRef?: MutableRefObject<FabricCanvas | null>;
  floorPlan?: FloorPlan;
  tool?: DrawingMode;
  onFloorPlanUpdate?: (floorPlan: FloorPlan) => void;
  isActive?: boolean;
  inputMethod?: 'mouse' | 'touch' | 'stylus';
  isPencilMode?: boolean;
  setInputMethod?: (method: 'mouse' | 'touch' | 'stylus') => void;
}

export const useFloorPlanDrawing = ({
  fabricCanvasRef = { current: null },
  floorPlan = {} as FloorPlan,
  tool = DrawingMode.SELECT,
  onFloorPlanUpdate = () => {},
  isActive = true,
  inputMethod = 'mouse',
  isPencilMode = false,
  setInputMethod = () => {}
}: UseFloorPlanDrawingProps = {}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Initialize drawing modes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Cleanup function for event handlers
    return () => {
      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');
    };
  }, [fabricCanvasRef, tool]);
  
  // Enable drawing mode based on selected tool
  const handleDrawingEvent = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Remove existing listeners
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    
    // Set up new listeners based on the current tool
    switch (tool) {
      case DrawingMode.SELECT:
        canvas.isDrawingMode = false;
        break;
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        break;
      default:
        canvas.isDrawingMode = false;
        break;
    }
  }, [fabricCanvasRef, tool]);
  
  // Draw the floor plan on the canvas
  const drawFloorPlan = useCallback((canvas: FabricCanvas, plan: FloorPlan) => {
    if (!canvas) return;
    
    // Clear canvas
    canvas.clear();
    
    // Set background
    canvas.backgroundColor = '#f0f0f0';
    
    // Render floor plan elements (simplified)
    canvas.renderAll();
    
  }, []);
  
  return {
    isDrawing,
    setIsDrawing,
    handleDrawingEvent,
    drawFloorPlan,
    // Provide minimal stub implementations for required methods
    saveState: () => console.log('Save state'),
    restoreState: () => console.log('Restore state'),
    snapPoint: (point: any) => point,
    addWall: () => console.log('Add wall'),
    addRoom: () => console.log('Add room'),
    addStroke: () => console.log('Add stroke'),
    updateObject: () => console.log('Update object'),
    deleteObject: () => console.log('Delete object')
  };
};
