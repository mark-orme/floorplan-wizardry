
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, PencilBrush } from 'fabric';
import { DebugInfoState } from '@/types/core/DebugInfo';
import { DrawingMode } from '@/constants/drawingModes';
import { createCompleteGrid } from '@/utils/grid/gridRenderers';
import { GridDebugOverlay } from './canvas/GridDebugOverlay';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { forceGridCreationAndVisibility } from '@/utils/grid/gridVisibility';

export interface CanvasProps {
  width: number;
  height: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  style?: React.CSSProperties;
  setDebugInfo?: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  tool?: DrawingMode;
  showGridDebug?: boolean;
  lineColor?: string;
  lineThickness?: number;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  width,
  height,
  onCanvasReady,
  onError,
  style,
  setDebugInfo,
  tool = DrawingMode.SELECT,
  showGridDebug = true,
  lineColor = '#000000',
  lineThickness = 2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridInitializedRef = useRef<boolean>(false);
  const gridAttemptCountRef = useRef<number>(0);
  const [gridError, setGridError] = useState<string | null>(null);
  const mountedRef = useRef<boolean>(true);

  // Create grid with retry mechanism
  const createGridWithRetry = React.useCallback((canvas: FabricCanvas) => {
    if (!canvas || gridInitializedRef.current || !mountedRef.current) return;
    
    const maxAttempts = 3;
    gridAttemptCountRef.current += 1;
    
    try {
      // Try to create grid
      let gridObjects = createCompleteGrid(canvas);
      
      // If grid creation failed, try emergency approach
      if (!gridObjects || gridObjects.length === 0) {
        if (forceGridCreationAndVisibility(canvas)) {
          gridInitializedRef.current = true;
          
          if (setDebugInfo) {
            setDebugInfo(prev => ({
              ...prev,
              gridCreated: true,
              gridRendered: true,
              gridObjectCount: canvas.getObjects().filter(obj => 
                (obj as any).objectType === 'grid' || (obj as any).isGrid === true
              ).length
            }));
          }
          
          return;
        }
      } else {
        // Force grid objects to be visible and non-selectable
        gridObjects.forEach(obj => {
          obj.set({
            visible: true,
            selectable: false,
            evented: false
          });
          
          // Ensure the grid is at the back
          canvas.sendObjectToBack(obj);
        });
        
        // Force render
        canvas.renderAll();
        
        if (setDebugInfo && gridObjects.length > 0) {
          setDebugInfo(prev => ({
            ...prev,
            gridCreated: true,
            gridRendered: true,
            gridObjectCount: gridObjects.length
          }));
        }
        
        gridInitializedRef.current = true;
        return;
      }
      
      // If we get here, both methods failed but we still have attempts left
      if (gridAttemptCountRef.current < maxAttempts && mountedRef.current) {
        setTimeout(() => createGridWithRetry(canvas), 500);
      } else {
        setGridError('Failed to create grid after multiple attempts');
      }
    } catch (error) {
      // Try one more time with emergency approach
      if (gridAttemptCountRef.current < maxAttempts && mountedRef.current) {
        setTimeout(() => createGridWithRetry(canvas), 500);
      }
    }
  }, [setDebugInfo]);

  // Apply tool when it changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Handle tool changes
    switch (tool) {
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = lineThickness;
          canvas.freeDrawingBrush.color = lineColor;
        }
        canvas.defaultCursor = 'crosshair';
        break;
      case DrawingMode.SELECT:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
      case DrawingMode.ERASER:
        canvas.isDrawingMode = false;
        canvas.defaultCursor = 'cell';
        break;
      case DrawingMode.STRAIGHT_LINE:
        canvas.isDrawingMode = false;
        canvas.defaultCursor = 'crosshair';
        // Make sure objects are selectable for straight line measurements
        canvas.selection = false;
        break;
      default:
        canvas.isDrawingMode = false;
        canvas.defaultCursor = 'crosshair';
        break;
    }
    
    canvas.renderAll();
  }, [tool, lineColor, lineThickness]);

  // Initialize canvas when component mounts
  useEffect(() => {
    mountedRef.current = true;
    
    // Only proceed if we have a valid canvas element
    if (!canvasRef.current) return;

    try {
      // Initialize Fabric.js canvas
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        selection: true
      });
      
      // Initialize the drawing brush
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new PencilBrush(canvas);
      }
      canvas.freeDrawingBrush.width = lineThickness;
      canvas.freeDrawingBrush.color = lineColor;
      
      // Store canvas reference
      fabricCanvasRef.current = canvas;

      // Update debug info if provided
      if (setDebugInfo) {
        setDebugInfo(prev => ({
          ...prev,
          canvasInitialized: true,
          canvasReady: true
        }));
      }

      // Initialize grid with retry mechanism
      const gridTimer = setTimeout(() => {
        if (mountedRef.current) {
          createGridWithRetry(canvas);
        }
      }, 100);

      // Notify parent that canvas is ready
      onCanvasReady(canvas);

      // Cleanup when component unmounts
      return () => {
        mountedRef.current = false;
        clearTimeout(gridTimer);
        
        // Cleanup canvas
        if (canvas) {
          canvas.dispose();
          fabricCanvasRef.current = null;
        }
      };
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
      
      if (setDebugInfo) {
        setDebugInfo(prev => ({
          ...prev,
          hasError: true,
          errorMessage: error instanceof Error ? error.message : String(error)
        }));
      }
    }
  }, [width, height, onCanvasReady, onError, setDebugInfo, createGridWithRetry, lineColor, lineThickness]);

  // Simplified render to avoid unnecessary elements
  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        data-testid="canvas"
        data-canvas-tool={tool}
        style={style}
      />
      
      {gridError && (
        <div className="absolute bottom-2 left-2 bg-red-100 text-red-800 p-2 rounded text-xs z-50">
          Grid Error: {gridError}
        </div>
      )}
      
      {showGridDebug && fabricCanvasRef.current && (
        <GridDebugOverlay 
          fabricCanvasRef={fabricCanvasRef} 
          visible={showGridDebug} 
        />
      )}
    </div>
  );
};
