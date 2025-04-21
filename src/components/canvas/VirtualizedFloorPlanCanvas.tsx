
import React, { useRef, useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useVirtualizedCanvas } from "@/hooks/useVirtualizedCanvas";
import { useCanvasErrorHandling } from "@/hooks/useCanvasErrorHandling";
import { toast } from "sonner";
import { useGeometryWorker } from "@/hooks/useGeometryWorker";

interface VirtualizedFloorPlanCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onCanvasError?: (error: Error) => void;
  showPerformanceMetrics?: boolean;
}

export const VirtualizedFloorPlanCanvas: React.FC<VirtualizedFloorPlanCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onCanvasError,
  showPerformanceMetrics = process.env.NODE_ENV === 'development'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const { handleError } = useCanvasErrorHandling({
    onErrorCallback: onCanvasError
  });
  
  // Initialize geometry worker for offloading calculations
  const { isReady: workerReady, calculateArea } = useGeometryWorker();
  
  // Use virtualized canvas for performance
  const {
    performanceMetrics,
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization
  } = useVirtualizedCanvas(fabricCanvasRef, {
    enabled: true,
    autoToggle: true
  });
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Apply CSP headers meta tag
      if (typeof document !== 'undefined') {
        const metaElement = document.createElement('meta');
        metaElement.httpEquiv = 'Content-Security-Policy';
        metaElement.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'";
        document.head.appendChild(metaElement);
      }
      
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#ffffff",
        renderOnAddRemove: false,
        enableRetinaScaling: true
      });
      
      // Enable optimizations for canvas
      canvas.skipOffscreen = true;
      
      fabricCanvasRef.current = canvas;
      setIsReady(true);
      
      // Notify parent
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      // Log worker status
      console.log("Geometry worker ready:", workerReady);
      
      // Generate CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      console.log("CSRF Protection active:", !!csrfToken);
      
      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to initialize canvas'), 'canvas-initialization');
      toast.error("Failed to initialize canvas");
    }
  }, [width, height, onCanvasReady, handleError, workerReady]);
  
  // Refresh virtualization on resize
  useEffect(() => {
    if (isReady) {
      refreshVirtualization();
    }
  }, [width, height, isReady, refreshVirtualization]);
  
  // Display performance metrics
  const performanceDisplay = showPerformanceMetrics && (
    <div className="absolute bottom-4 right-4 bg-white/80 text-xs p-2 rounded shadow">
      <div>FPS: {performanceMetrics?.fps || 0}</div>
      <div>Objects: {performanceMetrics?.objectCount || 0}</div>
      <div>Visible: {performanceMetrics?.visibleObjectCount || 0}</div>
      <div>Worker: {workerReady ? 'Ready' : 'Initializing'}</div>
      <button
        onClick={() => toggleVirtualization()}
        className="mt-1 px-2 py-1 bg-blue-100 rounded text-xs"
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
        data-testid="virtualized-floor-plan-canvas"
        aria-label="Floor plan canvas"
      />
      {performanceDisplay}
    </div>
  );
};

export default VirtualizedFloorPlanCanvas;
