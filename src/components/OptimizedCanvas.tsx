import React, { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useVirtualizedCanvas } from '../hooks/useVirtualizedCanvas';

interface OptimizedCanvasProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

export const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({ fabricCanvasRef }) => {
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
          <p>Render Count: {performanceMetrics.renderCount}</p>
          <p>Virtualization Enabled: {needsVirtualization ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};
