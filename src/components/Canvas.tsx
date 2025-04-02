
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
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
}

export const Canvas: React.FC<CanvasProps> = ({ 
  width,
  height,
  onCanvasReady,
  onError,
  style,
  setDebugInfo,
  tool,
  showGridDebug = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridInitializedRef = useRef<boolean>(false);
  const gridAttemptCountRef = useRef<number>(0);
  const [gridError, setGridError] = useState<string | null>(null);

  // Create grid with retry mechanism
  const createGridWithRetry = React.useCallback((canvas: FabricCanvas) => {
    if (!canvas || gridInitializedRef.current) return;
    
    const maxAttempts = 3;
    gridAttemptCountRef.current += 1;
    
    try {
      console.log(`Canvas: Creating grid (attempt ${gridAttemptCountRef.current}/${maxAttempts})`);
      const startTime = performance.now();
      
      // Try to create grid
      let gridObjects = createCompleteGrid(canvas);
      const endTime = performance.now();
      
      // If grid creation failed, try emergency approach
      if (!gridObjects || gridObjects.length === 0) {
        console.warn('Standard grid creation failed, forcing emergency grid');
        if (forceGridCreationAndVisibility(canvas)) {
          console.log('Emergency grid created successfully');
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
        console.log(`Canvas: Grid created with ${gridObjects.length} objects in ${(endTime - startTime).toFixed(2)}ms`);
        
        // Force grid objects to be visible and non-selectable
        gridObjects.forEach(obj => {
          obj.set({
            visible: true,
            selectable: false,
            evented: false
          });
          
          // Ensure the grid is at the back
          canvas.sendToBack(obj);
        });
        
        // Force render
        canvas.renderAll();
        canvas.requestRenderAll();
        
        if (setDebugInfo && gridObjects.length > 0) {
          setDebugInfo(prev => ({
            ...prev,
            gridCreated: true,
            gridRendered: true,
            gridObjectCount: gridObjects.length
          }));
        }
        
        gridInitializedRef.current = true;
        logger.info(`Grid created with ${gridObjects.length} objects`);
        return;
      }
      
      // If we get here, both methods failed but we still have attempts left
      if (gridAttemptCountRef.current < maxAttempts) {
        console.log(`Scheduling retry ${gridAttemptCountRef.current + 1}/${maxAttempts}`);
        setTimeout(() => createGridWithRetry(canvas), 500);
      } else {
        setGridError('Failed to create grid after multiple attempts');
        console.error('Failed to create grid after multiple attempts');
        toast.error('Failed to create grid after multiple attempts');
      }
    } catch (error) {
      console.error('Error in grid creation:', error);
      setGridError(error instanceof Error ? error.message : String(error));
      
      // Try one more time with emergency approach
      if (gridAttemptCountRef.current < maxAttempts) {
        console.log(`Scheduling retry after error ${gridAttemptCountRef.current + 1}/${maxAttempts}`);
        setTimeout(() => createGridWithRetry(canvas), 500);
      } else {
        console.error('Failed to create grid after error retries');
        toast.error('Failed to create grid');
      }
    }
  }, [setDebugInfo]);

  // Initialize canvas when component mounts
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      console.log("Canvas: Initializing fabric canvas");
      
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        selection: true
      });
      
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
      createGridWithRetry(canvas);

      // Notify parent that canvas is ready
      onCanvasReady(canvas);

      // Cleanup when component unmounts
      return () => {
        console.log("Canvas: Disposing fabric canvas");
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
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
      
      toast.error("Failed to initialize canvas");
    }
  }, [width, height, onCanvasReady, onError, setDebugInfo, createGridWithRetry]);

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
