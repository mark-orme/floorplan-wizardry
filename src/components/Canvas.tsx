
import React, { useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DebugInfoState } from '@/types/core/DebugInfo';
import { DrawingMode } from '@/constants/drawingModes';
import { createGrid } from '@/utils/canvasGrid';

export interface CanvasProps {
  width: number;
  height: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  style?: React.CSSProperties;
  setDebugInfo?: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  tool?: DrawingMode;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  width,
  height,
  onCanvasReady,
  onError,
  style,
  setDebugInfo,
  tool
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height
      });

      // Update debug info if provided
      if (setDebugInfo) {
        setDebugInfo(prev => ({
          ...prev,
          canvasInitialized: true,
          canvasReady: true
        }));
      }

      // Initialize grid on canvas
      if (!gridInitializedRef.current) {
        try {
          const gridObjects = createGrid(canvas);
          
          if (setDebugInfo && gridObjects.length > 0) {
            setDebugInfo(prev => ({
              ...prev,
              gridCreated: true,
              gridRendered: true,
              gridObjectCount: gridObjects.length
            }));
          }
          
          gridInitializedRef.current = true;
          console.log(`Grid created with ${gridObjects.length} objects`);
        } catch (gridError) {
          console.error('Error creating grid:', gridError);
          if (setDebugInfo) {
            setDebugInfo(prev => ({
              ...prev,
              hasError: true,
              errorMessage: `Grid error: ${gridError instanceof Error ? gridError.message : String(gridError)}`
            }));
          }
        }
      }

      onCanvasReady(canvas);

      return () => {
        canvas.dispose();
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
    }
  }, [width, height, onCanvasReady, onError, setDebugInfo]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      data-testid="canvas"
      data-canvas-tool={tool}
      style={style}
    />
  );
};
