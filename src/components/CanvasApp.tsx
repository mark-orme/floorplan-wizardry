import React from 'react';
import { useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import { toast } from 'sonner';
import { captureMessage } from '@/utils/sentryUtils';

interface CanvasAppProps {
  setCanvas: (canvas: FabricCanvas | null) => void;
  tool?: DrawingMode;
  enableSync?: boolean;
  width?: number;
  height?: number;
}

export const CanvasApp: React.FC<CanvasAppProps> = ({
  setCanvas,
  tool = DrawingMode.SELECT,
  enableSync = true,
  width = 800,
  height = 600
}) => {
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  
  // Register app start with Sentry
  useEffect(() => {
    captureMessage('Canvas app initialized', {
      level: 'info',
      tags: { component: 'CanvasApp' },
      extra: { 
        dimensions: `${width}x${height}`,
        tool,
        enableSync,
        userAgent: navigator.userAgent,
        isMobile: window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      }
    });
    
    logger.info("Canvas app initialized", {
      dimensions: `${width}x${height}`,
      tool,
      enableSync
    });
  }, [width, height, tool, enableSync]);
  
  // Handle canvas ready
  const handleCanvasReady = (canvas: FabricCanvas) => {
    logger.info("Canvas is ready");
    setCanvas(canvas);
    setCanvasLoaded(true);
    setIsReady(true);
    
    // Show success toast only on first load, not on recovery
    if (!hasError) {
      toast.success("Canvas loaded successfully");
    }
    
    // Report success to Sentry
    captureMessage('Canvas loaded successfully', {
      level: 'info',
      tags: { component: 'CanvasApp' }
    });
  };
  
  // Handle canvas error
  const handleCanvasError = (error: Error) => {
    logger.error("Canvas error:", error);
    setHasError(true);
    
    // Report error to Sentry
    captureMessage(`Canvas error: ${error.message}`, {
      level: 'error',
      tags: { component: 'CanvasApp' },
      extra: { error: error.message, stack: error.stack }
    });
    
    // Attempt recovery after delay
    setTimeout(() => {
      logger.info("Attempting canvas recovery");
      setHasError(false);
    }, 3000);
  };
  
  return (
    <div className="relative w-full h-full" data-testid="canvas-app">
      {/* Show loading indicator if canvas is not ready */}
      {!isReady && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-700">Loading canvas...</p>
          </div>
        </div>
      )}
      
      {/* Show error state if there's an error */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
          <div className="text-center max-w-md mx-auto p-4">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Canvas Error</h3>
            <p className="mt-2 text-gray-600">
              There was a problem loading the canvas. We're trying to recover automatically.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => setHasError(false)}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Main canvas */}
      <FloorPlanCanvas
        width={width}
        height={height}
        onCanvasReady={handleCanvasReady}
        onError={handleCanvasError}
        tool={tool}
        className={`transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};
