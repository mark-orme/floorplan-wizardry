import { useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import type { MutableRefObject } from 'react';
import { FloorPlan } from '@/types/floorPlan';
import { DrawingMode } from '@/constants/drawingModes';

interface UseFloorPlanDrawingProps {
  fabricCanvasRef: MutableRefObject<FabricCanvas | null>;
  floorPlan: FloorPlan;
  tool: DrawingMode;
  onFloorPlanUpdate: (fp: FloorPlan) => void;
}

export const useFloorPlanDrawing = ({
  fabricCanvasRef,
  floorPlan,
  tool = DrawingMode.SELECT,
  onFloorPlanUpdate = () => {}
}: UseFloorPlanDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    return () => {
      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');
    };
  }, [fabricCanvasRef, tool]);
  
  const handleDrawingEvent = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    
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
    
    onFloorPlanUpdate(floorPlan);
  }, [fabricCanvasRef, tool, floorPlan, onFloorPlanUpdate]);
  
  const drawFloorPlan = useCallback((canvas: FabricCanvas, plan: FloorPlan) => {
    if (!canvas) return;
    
    canvas.clear();
    
    canvas.backgroundColor = '#f0f0f0';
    
    canvas.renderAll();
  }, []);
  
  return {
    isDrawing,
    setIsDrawing,
    handleDrawingEvent,
    drawFloorPlan,
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
