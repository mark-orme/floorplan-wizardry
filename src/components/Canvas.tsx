
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DebugInfoState } from '@/types/core/DebugInfo';
import { DrawingMode } from '@/constants/drawingModes';
import { createCompleteGrid } from '@/utils/grid/gridRenderers';
import { GridDebugOverlay } from './canvas/GridDebugOverlay';
import { toast } from 'sonner';
import logger from '@/utils/logger';

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
  const [gridError, setGridError] = useState<string | null>(null);

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

      // Initialize grid on canvas with better error handling
      if (!gridInitializedRef.current) {
        try {
          console.log("Canvas: Creating grid");
          const startTime = performance.now();
          
          const gridObjects = createCompleteGrid(canvas);
          const endTime = performance.now();
          
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
        } catch (gridError) {
          console.error('Error creating grid:', gridError);
          setGridError(gridError instanceof Error ? gridError.message : String(gridError));
          
          if (setDebugInfo) {
            setDebugInfo(prev => ({
              ...prev,
              hasError: true,
              errorMessage: `Grid error: ${gridError instanceof Error ? gridError.message : String(gridError)}`
            }));
          }
          
          // Try to show an error toast
          toast.error("Failed to create grid. Check console for details.");
        }
      }

      onCanvasReady(canvas);

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
      
      // Try to show an error toast
      toast.error("Failed to initialize canvas");
    }
  }, [width, height, onCanvasReady, onError, setDebugInfo]);

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
