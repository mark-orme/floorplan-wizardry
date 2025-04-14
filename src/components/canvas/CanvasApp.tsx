
import React, { useState } from 'react';
import { Canvas } from '@/components/Canvas';
import { Canvas as FabricCanvas } from 'fabric';
import { DebugInfoState } from '@/types/core/DebugInfo';
import { DrawingMode } from '@/constants/drawingModes';

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
      lastError: error.message, // Convert Error to string by using error.message
      lastErrorTime: Date.now()
    }));
  };

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
      />
    </div>
  );
};
