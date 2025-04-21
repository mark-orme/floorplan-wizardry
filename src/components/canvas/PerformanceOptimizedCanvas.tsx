
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useVirtualizedCanvas } from '@/hooks/useVirtualizedCanvas';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import { toast } from 'sonner';

interface PerformanceOptimizedCanvasProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onCanvasError?: (error: Error) => void;
  showPerformanceData?: boolean;
  className?: string;
}

export const PerformanceOptimizedCanvas: React.FC<PerformanceOptimizedCanvasProps> = ({
  width,
  height,
  onCanvasReady,
  onCanvasError,
  showPerformanceData = false,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize virtualization
  const {
    virtualizationEnabled,
    toggleVirtualization,
    performanceMetrics,
    refreshVirtualization
  } = useVirtualizedCanvas(fabricCanvasRef, {
    enabled: true,
    autoToggle: true,
    autoToggleThreshold: 100
  });
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        renderOnAddRemove: false, // Important for performance
        enableRetinaScaling: true // Better on high-DPI displays
      });
      
      fabricCanvasRef.current = canvas;
      
      // Configure for best performance
      canvas.skipOffscreen = true; // Skip rendering objects not in viewport
      canvas.stopContextMenu = true; // Prevent context menu on right-click
      
      // Set up tools
      canvas.isDrawingMode = false;
      canvas.selection = true;
      
      // Set up event handlers for lazy rendering (performance optimization)
      const debouncedRender = debounce(() => {
        canvas.requestRenderAll();
      }, 10);
      
      const optimizeMouse = (e: any) => {
        refreshVirtualization();
        debouncedRender();
      };
      
      canvas.on('mouse:wheel', optimizeMouse);
      canvas.on('mouse:down', optimizeMouse);
      canvas.on('mouse:up', optimizeMouse);
      
      // Notify parent when canvas is ready
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      setIsInitialized(true);
      logger.info('Canvas initialized with performance optimizations');
      
      // Clean up function
      return () => {
        canvas.off('mouse:wheel', optimizeMouse);
        canvas.off('mouse:down', optimizeMouse);
        canvas.off('mouse:up', optimizeMouse);
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      logger.error('Failed to initialize canvas', { error });
      if (onCanvasError && error instanceof Error) {
        onCanvasError(error);
      }
      toast.error('Failed to initialize canvas');
    }
  }, [width, height, onCanvasReady, onCanvasError, refreshVirtualization]);
  
  // Update canvas on resize
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas && isInitialized) {
      canvas.setDimensions({ width, height });
      refreshVirtualization();
    }
  }, [width, height, isInitialized, refreshVirtualization]);
  
  // Simple debounce function
  function debounce(func: Function, wait: number) {
    let timeout: number;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);
    };
  }
  
  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded shadow-sm"
        data-testid="optimized-canvas"
      />
      
      {showPerformanceData && (
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 text-xs p-2 rounded shadow">
          <div>FPS: {performanceMetrics.fps}</div>
          <div>Objects: {performanceMetrics.objectCount}</div>
          <div>Visible: {performanceMetrics.visibleObjectCount}</div>
          <button
            onClick={() => toggleVirtualization()}
            className="mt-1 px-2 py-0.5 bg-blue-100 rounded text-xs"
          >
            {virtualizationEnabled ? 'Disable' : 'Enable'} Virtualization
          </button>
        </div>
      )}
    </div>
  );
};

export default PerformanceOptimizedCanvas;
