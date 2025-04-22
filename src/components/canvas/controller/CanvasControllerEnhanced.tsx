import React, { useState, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { useCanvasControllerDependencies } from './useCanvasControllerDependencies';
import { useCanvasControllerDrawingState } from './useCanvasControllerDrawingState';
import { useCanvasControllerFloorPlans } from './useCanvasControllerFloorPlans';
import { DrawingMode } from '@/constants/drawingModes';
import { FloorPlan } from '@/types/core';

interface CanvasControllerEnhancedProps {
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  initialTool?: DrawingMode;
  width?: number;
  height?: number;
  showDebug?: boolean;
}

export const CanvasControllerEnhanced: React.FC<CanvasControllerEnhancedProps> = ({
  onCanvasReady,
  onError,
  initialTool = DrawingMode.SELECT,
  width = 800,
  height = 600,
  showDebug = false
}) => {
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  // State
  const [tool, setTool] = useState<DrawingMode>(initialTool);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [gia, setGia] = useState(0);
  const [lineThickness, setLineThickness] = useState(2);
  const [lineColor, setLineColor] = useState('#000000');
  const [drawingState, setDrawingState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // History
  const historyRef = useRef<{ past: any[], future: any[] }>({ past: [], future: [] });
  
  // Initialize controller dependencies
  const { gridLayerRef, createGrid } = useCanvasControllerDependencies({
    fabricCanvasRef,
    canvasRef
  });
  
  // Drawing state handling
  useCanvasControllerDrawingState({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor,
    deleteSelectedObjects: () => {},
    setDrawingState
  });
  
  // Floor plans handling
  const { 
    drawFloorPlan,
    handleFloorSelect,
    handleAddFloor,
    loadData
  } = useCanvasControllerFloorPlans({
    fabricCanvasRef,
    gridLayerRef,
    floorPlans,
    currentFloor,
    isLoading,
    setGia,
    setFloorPlans,
    setCurrentFloor,
    clearDrawings: () => {},
    createGrid,
    recalculateGIA: () => {}
  });
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        renderOnAddRemove: true
      });
      
      // Store reference
      fabricCanvasRef.current = canvas;
      
      // Create grid
      const gridObjects = createGrid(canvas);
      gridLayerRef.current = gridObjects;
      
      // Notify parent
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      // Clean up
      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      if (error instanceof Error) {
        onError?.(error);
        toast.error(`Canvas error: ${error.message}`);
      }
    }
  }, [width, height, onCanvasReady, onError, createGrid]);
  
  // Load floor plans
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  return (
    <div className="canvas-controller-enhanced">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 shadow-sm"
        width={width}
        height={height}
      />
      
      {showDebug && (
        <div className="mt-4 text-sm">
          <p>Tool: {tool}</p>
          <p>Floor: {currentFloor}</p>
          <p>GIA: {gia} m²</p>
          <p>Floor Plans: {floorPlans.length}</p>
        </div>
      )}
    </div>
  );
};
