
import React, { useRef, useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useVirtualizedCanvas } from "@/hooks/useVirtualizedCanvas";
import { useCanvasErrorHandling } from "@/hooks/useCanvasErrorHandling";
import { useGeometryWorker } from "@/hooks/useGeometryWorker";
import { toast } from "sonner";
import { getCSRFToken } from "@/utils/security/csrfHandler";

interface FloorPlanCanvasEnhancedMainProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onCanvasError?: (error: Error) => void;
  showPerformanceMetrics?: boolean;
  showSecurityInfo?: boolean;
}

export const FloorPlanCanvasEnhancedMain: React.FC<FloorPlanCanvasEnhancedMainProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onCanvasError,
  showPerformanceMetrics = process.env.NODE_ENV === 'development',
  showSecurityInfo = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const { handleError } = useCanvasErrorHandling({
    onErrorCallback: onCanvasError
  });
  
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
  
  // Use web worker for geometry calculations
  const { isReady: workerReady, calculateArea } = useGeometryWorker();
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#ffffff",
        renderOnAddRemove: false,
        enableRetinaScaling: true
      });
      
      // Apply optimizations
      canvas.skipOffscreen = true;
      canvas.skipTargetFind = false;
      
      fabricCanvasRef.current = canvas;
      setIsReady(true);
      
      // Notify parent
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      // Accessibility enhancement: add ARIA role and label
      canvasRef.current.setAttribute('role', 'img');
      canvasRef.current.setAttribute('aria-label', 'Floor plan editor canvas');
      
      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to initialize canvas'), 'canvas-initialization');
      toast.error("Failed to initialize canvas");
    }
  }, [width, height, onCanvasReady, handleError]);
  
  // Refresh virtualization on resize
  useEffect(() => {
    if (isReady) {
      refreshVirtualization();
    }
  }, [width, height, isReady, refreshVirtualization]);
  
  // Handle when the object count changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const handleObjectAdded = () => refreshVirtualization();
    const handleObjectRemoved = () => refreshVirtualization();
    
    fabricCanvasRef.current.on('object:added', handleObjectAdded);
    fabricCanvasRef.current.on('object:removed', handleObjectRemoved);
    
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.off('object:added', handleObjectAdded);
        fabricCanvasRef.current.off('object:removed', handleObjectRemoved);
      }
    };
  }, [refreshVirtualization]);
  
  // Performance metrics display
  const performanceDisplay = showPerformanceMetrics && (
    <div className="absolute bottom-4 right-4 bg-white/80 text-xs p-2 rounded shadow">
      <div>FPS: {performanceMetrics?.fps || 0}</div>
      <div>Objects: {performanceMetrics?.objectCount || 0}</div>
      <div>Visible: {performanceMetrics?.visibleObjectCount || 0}</div>
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
  
  // Security info display
  const securityDisplay = showSecurityInfo && (
    <div className="absolute top-4 right-4 bg-white/80 text-xs p-2 rounded shadow">
      <div>CSRF Token: {getCSRFToken() ? '✅ Active' : '❌ Missing'}</div>
      <div>CSP: {document.querySelector('meta[http-equiv="Content-Security-Policy"]') ? '✅ Active' : '❌ Missing'}</div>
    </div>
  );
  
  return (
    <div className="relative" data-testid="enhanced-floor-plan-canvas">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded"
        aria-label="Floor plan canvas"
      />
      {performanceDisplay}
      {securityDisplay}
    </div>
  );
};

export default FloorPlanCanvasEnhancedMain;
