
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan } from '@/types/floorPlan';
import { DrawingMode } from '@/constants/drawingModes';
import type { MutableRefObject } from 'react';

interface UseFloorPlanDrawingProps {
  fabricCanvasRef?: MutableRefObject<FabricCanvas | null>;
  floorPlan?: FloorPlan;
  tool?: DrawingMode;
  onFloorPlanUpdate?: (floorPlan: FloorPlan) => void;
  isActive?: boolean;
  initialHistory?: FloorPlan[];
}

export const useFloorPlanDrawing = ({
  fabricCanvasRef = { current: null },
  floorPlan = {} as FloorPlan,
  tool = DrawingMode.SELECT,
  onFloorPlanUpdate = () => {},
  isActive = true,
  initialHistory = []
}: UseFloorPlanDrawingProps = {}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingMode>(tool);
  const [lineColor, setLineColor] = useState<string>("#000");
  const [lineThickness, setLineThickness] = useState<number>(1);
  
  // History stack for undo/redo
  const [history, setHistory] = useState<FloorPlan[]>(initialHistory);
  const [redoStack, setRedoStack] = useState<FloorPlan[]>([]);
  
  const canUndo = history.length > 0;
  const canRedo = redoStack.length > 0;

  const handleDrawingEvent = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = currentTool === DrawingMode.DRAW;
  }, [fabricCanvasRef, currentTool]);

  const drawFloorPlan = useCallback((canvas: FabricCanvas, plan: FloorPlan) => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#f0f0f0';
    canvas.renderAll();
  }, []);

  const undo = useCallback(() => {
    if (!canUndo) return;
    const prevState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, prevState]);
  }, [canUndo, history]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setHistory(prev => [...prev, nextState]);
  }, [canRedo, redoStack]);

  return {
    isDrawing,
    setIsDrawing,
    currentTool,
    setCurrentTool,
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness,
    canvas: fabricCanvasRef.current,
    handleDrawingEvent,
    drawFloorPlan,
    saveState: () => console.log('Save state'),
    restoreState: () => console.log('Restore state'),
    snapPoint: (point: any) => point,
    addWall: () => console.log('Add wall'),
    addRoom: () => console.log('Add room'),
    addStroke: () => console.log('Add stroke'),
    updateObject: () => console.log('Update object'),
    deleteObject: () => console.log('Delete object'),
    undo,
    redo,
    canUndo,
    canRedo
  };
};
