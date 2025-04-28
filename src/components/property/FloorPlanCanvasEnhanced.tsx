import React, { useRef, useEffect, useState } from "react";
import { fabric } from "fabric";
import { useVirtualizedCanvas } from "@/hooks/useVirtualizedCanvas";
import { useCanvasErrorHandling } from "@/hooks/useCanvasErrorHandling";
import { useGeometryWorker } from "@/hooks/useGeometryWorker";
import { getCSRFToken } from "@/utils/security/csrfHandler";
import { toast } from "sonner";
import { asExtendedCanvas, type ExtendedFabricCanvas } from '@/types/canvas-types';

interface FloorPlanCanvasEnhancedProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: ExtendedFabricCanvas) => void;
  onCanvasError?: (error: Error) => void;
  showPerformanceMetrics?: boolean;
}

export const FloorPlanCanvasEnhanced: React.FC<FloorPlanCanvasEnhancedProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onCanvasError,
  showPerformanceMetrics = process.env.NODE_ENV === 'development'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<ExtendedFabricCanvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const { handleCanvasError } = useCanvasErrorHandling({
    onCanvasError
  });
  
  const { isReady: workerReady } = useGeometryWorker();
  
  const {
    performanceMetrics,
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization
  } = useVirtualizedCanvas(fabricCanvasRef, {
    enabled: true
  });
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#ffffff",
        renderOnAddRemove: false,
        enableRetinaScaling: true
      });

      const extendedCanvas = asExtendedCanvas(canvas as unknown as ExtendedFabricCanvas);
      
      if (extendedCanvas) {
        extendedCanvas.skipOffscreen = true;
      }
      
      fabricCanvasRef.current = extendedCanvas;
      setIsReady(true);
      
      if (onCanvasReady) {
        onCanvasReady(extendedCanvas);
      }
      
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        console.log("CSRF protection active");
      }
      
      canvasRef.current.setAttribute('aria-label', 'Floor plan canvas');
      
      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      handleCanvasError(error instanceof Error ? error : new Error('Failed to initialize canvas'));
      toast.error("Failed to initialize canvas");
    }
  }, [width, height, onCanvasReady, handleCanvasError]);
  
  useEffect(() => {
    if (isReady) {
      refreshVirtualization();
    }
  }, [width, height, isReady, refreshVirtualization]);
  
  const performanceDisplay = showPerformanceMetrics && performanceMetrics && (
    <div className="absolute bottom-4 right-4 bg-white/80 text-xs p-2 rounded shadow">
      <div>FPS: {performanceMetrics.fps || 0}</div>
      <div>Objects: {performanceMetrics.objectCount || 0}</div>
      <div>Visible: {performanceMetrics.visibleObjectCount !== undefined 
        ? performanceMetrics.visibleObjectCount 
        : 'N/A'}</div>
      <div>Worker: {workerReady ? 'Ready' : 'Initializing'}</div>
      <button
        onClick={() => toggleVirtualization()}
        className="mt-1 px-2 py-1 bg-blue-100 rounded text-xs"
        aria-label={virtualizationEnabled ? 'Disable virtualization' : 'Enable virtualization'}
      >
        {virtualizationEnabled ? 'Disable' : 'Enable'} Virtualization
      </button>
    </div>
  );
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded"
        data-testid="floor-plan-canvas"
      />
      {performanceDisplay}
    </div>
  );
};

export default FloorPlanCanvasEnhanced;
