
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas';
import { useRestorePrompt } from '@/hooks/useRestorePrompt';

interface CanvasProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  showGridDebug?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  onCanvasReady,
  onError,
  showGridDebug = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasId = useRef<string>(`canvas-${Math.random().toString(36).substring(2, 9)}`).current;
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true
      });
      
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [width, height, onCanvasReady, onError]);
  
  return (
    <div className="canvas-wrapper relative" data-testid="canvas-element">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-200 dark:border-gray-700 shadow-sm"
        data-canvas-id={canvasId}
        data-show-grid-debug={showGridDebug ? 'true' : 'false'}
      />
      
      {/* Debug overlay */}
      {showGridDebug && (
        <div className="absolute top-0 right-0 bg-red-100 text-red-800 p-1 text-xs rounded m-1 opacity-75">
          Debug Mode
        </div>
      )}
    </div>
  );
};
