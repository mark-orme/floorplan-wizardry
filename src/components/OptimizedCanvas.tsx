
import React, { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useVirtualizedCanvas } from '../hooks/useVirtualizedCanvas';
import { DrawingMode } from '@/constants/drawingModes';

interface OptimizedCanvasProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  width: number;
  height: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  showGrid?: boolean;
}

export const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({ 
  fabricCanvasRef,
  width,
  height,
  onCanvasReady,
  onError,
  tool,
  lineColor,
  lineThickness,
  showGrid
}) => {
  const { performanceMetrics, needsVirtualization, refreshVirtualization } = useVirtualizedCanvas(fabricCanvasRef);

  useEffect(() => {
    if (needsVirtualization) {
      refreshVirtualization();
    }
  }, [needsVirtualization, refreshVirtualization]);

  return (
    <div>
      {/* Debugging Metrics - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 left-0 p-2 bg-white/50 z-50">
          <p>Total Objects: {performanceMetrics.objectCount}</p>
          <p>Visible Objects: {performanceMetrics.visibleObjectCount}</p>
          <p>FPS: {performanceMetrics.fps}</p>
          <p>Virtualization Enabled: {needsVirtualization ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};
