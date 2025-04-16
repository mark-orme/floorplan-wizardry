
import React, { useRef, useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { DrawingMode } from '@/constants/drawingModes';
import { CanvasInitializer } from './CanvasInitializer';
import { canvasGrid } from '@/utils/canvasGrid';
import { ErrorBoundary } from '@/utils/canvas/errorBoundary';
import { GridDebugOverlay } from './GridDebugOverlay';
import { GridMonitor } from './GridMonitor';
import { CanvasWithFallback } from './CanvasWithFallback';
import logger from '@/utils/logger';
import { captureMessage } from '@/utils/sentryUtils';

interface CanvasAppProps {
  width?: number;
  height?: number;
  tool?: DrawingMode;
  lineThickness?: number;
  lineColor?: string;
  showGridDebug?: boolean;
  onCanvasInitialized?: (canvas: FabricCanvas) => void;
}

export const CanvasApp: React.FC<CanvasAppProps> = ({
  width = 800,
  height = 600,
  tool = 'select',
  lineThickness = 2,
  lineColor = '#000000',
  showGridDebug = false,
  onCanvasInitialized
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo | null>(null);
  const [canvasReady, setCanvasReady] = useState<boolean>(false);
  
  useEffect(() => {
    logger.info('[canvas-app-init] CanvasApp component mounted');
    
    captureMessage('CanvasApp component mounted', 'canvas-mount', {
      level: 'info',
      tags: {
        component: 'CanvasApp'
      }
    });
    
    return () => {
      logger.info('[canvas-app-cleanup] CanvasApp component unmounting');
      
      // Clean up fabric canvas if needed
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        } catch (error) {
          console.error('Error disposing canvas:', error);
        }
      }
    };
  }, []);
  
  const handleCanvasInitialized = (canvas: FabricCanvas) => {
    fabricCanvasRef.current = canvas;
    setCanvasReady(true);
    
    // Create grid on canvas
    try {
      if (canvas && canvas.width && canvas.height) {
        const gridObjects = canvasGrid.createGrid(canvas);
        gridLayerRef.current = gridObjects;
        logger.info(`Grid created with ${gridObjects.length} objects`);
      }
    } catch (error) {
      console.error('Error creating grid:', error);
    }
    
    // Call external handler if provided
    if (onCanvasInitialized) {
      onCanvasInitialized(canvas);
    }
  };
  
  const handleCanvasError = (err: Error) => {
    console.error('Canvas error:', err);
    setError(err);
    toast.error('Canvas initialization error');
  };
  
  return (
    <ErrorBoundary componentName="CanvasApp">
      <div className="relative">
        <CanvasWithFallback
          width={width}
          height={height}
          tool={tool}
          lineThickness={lineThickness}
          lineColor={lineColor}
          onCanvasInitialized={handleCanvasInitialized}
          onError={handleCanvasError}
          className="border border-gray-200 rounded-lg overflow-hidden shadow-md"
        />
        
        {showGridDebug && canvasReady && (
          <>
            <GridDebugOverlay
              fabricCanvasRef={fabricCanvasRef}
              visible={showGridDebug}
            />
            <GridMonitor
              canvas={fabricCanvasRef.current}
              gridObjects={gridLayerRef.current}
              createGrid={() => {
                if (fabricCanvasRef.current) {
                  const objects = canvasGrid.createGrid(fabricCanvasRef.current);
                  gridLayerRef.current = objects;
                  return objects;
                }
                return [];
              }}
              visible={showGridDebug}
            />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};
