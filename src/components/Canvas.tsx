
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, PencilBrush } from 'fabric';
import { DebugInfoState } from '@/types/core/DebugInfo';
import { DrawingMode } from '@/constants/drawingModes';
import { GridRendererComponent } from './canvas/grid/GridRenderer';
import { GridDebugOverlay } from './canvas/GridDebugOverlay';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { forceGridCreationAndVisibility } from '@/utils/grid/gridVisibility';
import { useWallDrawing } from '@/hooks/useWallDrawing';
import { useStraightLineTool } from '@/hooks/straightLineTool/useStraightLineTool';
import { useSnapToGrid } from '@/hooks/useSnapToGrid';

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
  wallColor?: string;
  wallThickness?: number;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  width,
  height,
  onCanvasReady,
  onError,
  style,
  setDebugInfo,
  tool = DrawingMode.SELECT,
  showGridDebug = false,
  lineColor = '#000000',
  lineThickness = 2,
  wallColor = '#333333',
  wallThickness = 4
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [gridError, setGridError] = useState<string | null>(null);
  const mountedRef = useRef<boolean>(true);

  // Initialize the snap to grid functionality
  const { snapPointToGrid, snapLineToGrid, toggleSnapToGrid, snapEnabled } = useSnapToGrid({
    fabricCanvasRef
  });

  // Use wall drawing hook
  const { isDrawing: isDrawingWall } = useWallDrawing({
    fabricCanvasRef,
    tool,
    wallColor,
    wallThickness
  });

  // Use straight line tool hook with save state function
  const { isActive: isStraightLineActive } = useStraightLineTool({
    fabricCanvasRef,
    tool,
    lineColor,
    lineThickness,
    saveCurrentState: () => {
      // This would normally save the state for undo/redo
      console.log("Saving canvas state");
    }
  });

  // Handle selection and deletion functionality
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Delete or Backspace key pressed
    if ((e.key === 'Delete' || e.key === 'Backspace') && tool === DrawingMode.SELECT) {
      const selectedObjects = canvas.getActiveObjects();
      
      if (selectedObjects.length > 0) {
        // Filter out grid objects
        const nonGridObjects = selectedObjects.filter(obj => 
          !(obj as any).isGrid && (obj as any).objectType !== 'grid'
        );
        
        if (nonGridObjects.length > 0) {
          canvas.remove(...nonGridObjects);
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          toast.success(`Deleted ${nonGridObjects.length} object(s)`);
        }
      }
    }
  };

  // Set up key event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tool]);

  // Handle tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    switch (tool) {
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = lineThickness;
          canvas.freeDrawingBrush.color = lineColor;
        }
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
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
      case DrawingMode.LINE:
        canvas.isDrawingMode = false;
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        break;
      case DrawingMode.WALL:
        canvas.isDrawingMode = false;
        canvas.defaultCursor = 'crosshair';
        canvas.selection = false;
        break;
      default:
        canvas.isDrawingMode = false;
        canvas.defaultCursor = 'crosshair';
        break;
    }
    
    canvas.renderAll();
  }, [tool, lineColor, lineThickness, wallColor, wallThickness]);

  // Initialize canvas
  useEffect(() => {
    mountedRef.current = true;
    
    if (!canvasRef.current) return;

    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: Math.max(width, window.innerWidth),
        height: Math.max(height, window.innerHeight),
        selection: true
      });
      
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new PencilBrush(canvas);
      }
      canvas.freeDrawingBrush.width = lineThickness;
      canvas.freeDrawingBrush.color = lineColor;
      
      fabricCanvasRef.current = canvas;

      if (setDebugInfo) {
        setDebugInfo(prev => ({
          ...prev,
          canvasInitialized: true,
          canvasReady: true
        }));
      }

      // Make canvas globally available for debugging
      if (typeof window !== 'undefined') {
        (window as any).fabricCanvas = canvas;
      }

      onCanvasReady(canvas);

      return () => {
        mountedRef.current = false;
        
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
          errorMessage: error instanceof Error ? error.message : String(error),
          lastError: error instanceof Error ? error.message : String(error),
          lastErrorTime: Date.now()
        }));
      }
    }
  }, [width, height, onCanvasReady, onError, setDebugInfo, lineColor, lineThickness, wallColor, wallThickness]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!fabricCanvasRef.current) return;
      
      const canvas = fabricCanvasRef.current;
      
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Re-render grid after resize
      forceGridCreationAndVisibility(canvas);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        data-testid="canvas"
        data-canvas-tool={tool}
        style={{ ...style, position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      />
      
      {fabricCanvasRef.current && (
        <GridRendererComponent 
          canvas={fabricCanvasRef.current}
          showGrid={true}
          onGridCreated={(gridObjects) => {
            logger.info(`Grid created with ${gridObjects.length} objects`);
          }}
        />
      )}
      
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
