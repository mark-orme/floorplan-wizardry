
import React, { useState, useEffect } from 'react';
import { Canvas } from '@/components/Canvas';
import { Canvas as FabricCanvas } from 'fabric';
import { DebugInfoState } from '@/types/core/DebugInfo';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';

interface CanvasAppProps {
  setCanvas: (canvas: FabricCanvas) => void;
  showGridDebug?: boolean;
  tool?: DrawingMode;
  lineThickness?: number;
  lineColor?: string;
}

export const CanvasApp: React.FC<CanvasAppProps> = ({ 
  setCanvas, 
  showGridDebug = false,
  tool = DrawingMode.SELECT,
  lineThickness = 2,
  lineColor = '#000000' 
}) => {
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    hasError: false,
    errorMessage: '',
    lastInitTime: 0,
    lastGridCreationTime: 0,
    eventHandlersSet: false,
    canvasEventsRegistered: false,
    gridRendered: false,
    toolsInitialized: false,
    gridCreated: false,
    canvasInitialized: false,
    dimensionsSet: false,
    brushInitialized: false,
    canvasReady: false,
    canvasCreated: false,
    gridObjectCount: 0,
    canvasDimensions: {
      width: 0,
      height: 0
    },
    lastError: '',
    lastRefresh: Date.now()
  });

  const handleCanvasReady = (canvas: FabricCanvas) => {
    console.log('Canvas is ready');
    setCanvas(canvas);
    
    // Ensure grid is visible by forcing a re-render
    setTimeout(() => {
      canvas.requestRenderAll();
      console.log('Forcing canvas re-render to ensure grid visibility');
    }, 100);
    
    // Store canvas in window for debugging
    if (typeof window !== 'undefined') {
      (window as any).fabricCanvas = canvas;
    }
  };

  const handleCanvasError = (error: Error) => {
    console.error('Canvas error:', error);
    setDebugInfo(prev => ({
      ...prev,
      hasError: true,
      errorMessage: error.message,
      lastError: error.message, // Use string instead of Error object
      lastErrorTime: Date.now()
    }));
    
    toast.error(`Canvas error: ${error.message}`);
  };

  // Monitor grid state and log warnings if grid isn't created
  useEffect(() => {
    if (debugInfo.canvasCreated && !debugInfo.gridCreated) {
      console.warn('Grid not created but canvas exists - this may indicate a problem');
    }
    
    if (debugInfo.gridObjectCount === 0 && debugInfo.canvasCreated) {
      console.warn('Grid has 0 objects - grid may be invisible');
    }
  }, [debugInfo]);

  return (
    <div className="w-full h-full">
      <Canvas
        width={window.innerWidth}
        height={window.innerHeight}
        onCanvasReady={handleCanvasReady}
        onError={handleCanvasError}
        setDebugInfo={setDebugInfo}
        showGridDebug={showGridDebug}
        tool={tool}
        lineThickness={lineThickness}
        lineColor={lineColor}
        wallColor="#444444"
        wallThickness={4}
        style={{ width: '100%', height: '100%' }}
        forceGridVisible={true} // Force grid to be always visible
      />
    </div>
  );
};
