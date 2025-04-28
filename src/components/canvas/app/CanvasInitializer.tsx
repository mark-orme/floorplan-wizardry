
import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useCanvas } from '@/hooks/useCanvas';
import logger from '@/utils/logger';
import { ExtendedFabricCanvas } from '@/types/canvas-types';

// Define our own GRID_CONSTANTS to avoid the import error
const GRID_CONSTANTS = {
  DEFAULT_GRID_SIZE: 50,
  SMALL: {
    COLOR: 'rgba(200, 200, 200, 0.2)',
    WIDTH: 0.5
  },
  LARGE: {
    COLOR: 'rgba(180, 180, 180, 0.5)',
    WIDTH: 1
  }
};

interface CanvasInitializerProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onReady?: (canvas: ExtendedFabricCanvas) => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
}

export const CanvasInitializer: React.FC<CanvasInitializerProps> = ({
  width = 800,
  height = 600,
  backgroundColor = '#ffffff',
  onReady,
  onError,
  children
}) => {
  const { canvasRef, setCanvas } = useCanvas();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    try {
      logger.info('Initializing canvas');
      
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor
      }) as unknown as ExtendedFabricCanvas;

      setCanvas(fabricCanvas);
      setIsInitialized(true);
      
      if (onReady) {
        onReady(fabricCanvas);
      }
      
      logger.info('Canvas initialized successfully');
    } catch (err) {
      const error = new Error("Canvas initialization failed");
      logger.error('Canvas initialization failed:', err);
      setError(error);
      
      if (onError) {
        onError(error);
      }
    }
  }, [canvasRef, width, height, backgroundColor, onReady, onError, setCanvas, isInitialized]);

  if (error) {
    return (
      <div className="canvas-error">
        <h3>Failed to initialize canvas</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="canvas-initializer">
      {!isInitialized && (
        <div className="canvas-loading">
          <span>Initializing canvas...</span>
        </div>
      )}
      {children}
    </div>
  );
};
