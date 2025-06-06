import React, { useRef, useState, useEffect } from 'react';
import * as fabric from 'fabric';
import type { ExtendedFabricCanvas } from '@/types/canvas-types';
import { toast } from 'sonner';
import { DrawingMode } from '@/constants/drawingModes';
import { useGrid } from '@/hooks/useGrid';
import type { FloorPlan } from '@/types/floorPlanTypes';
import { asExtendedCanvas } from '@/utils/canvas/canvasTypeUtils';

interface CanvasControllerEnhancedProps {
  onCanvasReady?: (canvas: ExtendedFabricCanvas) => void;
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
  const fabricCanvasRef = useRef<fabric.Canvas | ExtendedFabricCanvas | null>(null);
  
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
  
  // Initialize grid utilities
  const gridLayerRef = useRef<fabric.Object[]>([]);
  const { createGrid } = useGrid({
    fabricCanvasRef: fabricCanvasRef as React.MutableRefObject<fabric.Canvas | ExtendedFabricCanvas | null>,
    gridLayerRef,
    initialGridSize: 20,
    initialVisible: true
  });
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Create canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        renderOnAddRemove: true
      });
      
      // Cast to extended canvas for type safety
      const extendedCanvas = asExtendedCanvas(canvas);
      
      if (extendedCanvas) {
        fabricCanvasRef.current = extendedCanvas;
        
        // Create grid
        if (createGrid) {
          createGrid(extendedCanvas);
        }
        
        // Notify parent
        if (onCanvasReady) {
          onCanvasReady(extendedCanvas);
        }
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
