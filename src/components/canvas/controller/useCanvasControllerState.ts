
import { useState, useRef } from 'react';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import type { FloorPlan } from '@/types/FloorPlan';

export const useCanvasControllerState = () => {
  // Canvas state
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState('#000000');
  const [showGrid, setShowGrid] = useState(true);
  
  // Floor plan state
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  
  // Undo/redo history
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Performance metrics
  const [fps, setFps] = useState(0);
  const [objectCount, setObjectCount] = useState(0);
  
  // Dimensions
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 800,
    height: 600
  });
  
  // Refs for stable values
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  return {
    // Canvas state
    fabricCanvas,
    setFabricCanvas,
    activeTool,
    setActiveTool,
    lineThickness,
    setLineThickness,
    lineColor,
    setLineColor,
    showGrid,
    setShowGrid,
    
    // Floor plan state
    floorPlans,
    setFloorPlans,
    currentFloorIndex,
    setCurrentFloorIndex,
    isDirty,
    setIsDirty,
    
    // History state
    canUndo,
    setCanUndo,
    canRedo,
    setCanRedo,
    
    // Performance metrics
    fps,
    setFps,
    objectCount,
    setObjectCount,
    
    // Dimensions
    canvasDimensions,
    setCanvasDimensions,
    
    // Refs
    canvasRef
  };
};
