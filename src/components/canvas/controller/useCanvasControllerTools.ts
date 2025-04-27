
/**
 * Hook for managing canvas tools and interactions
 */
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { createGrid } from '@/utils/grid/gridRenderers';
import { toast } from 'sonner';

interface UseCanvasControllerToolsOptions {
  enableVirtualization?: boolean;
}

// Simplified virtualization hook functions
const useVirtualizedCanvas = (canvasRef: any, options: any = {}) => {
  return {
    performanceMetrics: {
      fps: 60,
      renderDuration: 0,
      objectCount: 0,
      throttled: false,
      lastUpdate: Date.now()
    },
    refreshVirtualization: () => {}
  };
};

// Utility functions (placeholders for now)
const isPressureSupported = () => false;
const isTiltSupported = () => false;

export const useCanvasControllerTools = (canvas: FabricCanvas | null, options: UseCanvasControllerToolsOptions = {}) => {
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState<string>("#000000");
  const [lineThickness, setLineThickness] = useState<number>(2);
  const gridObjectsRef = useRef<any[]>([]);
  const canvasRef = useRef<FabricCanvas | null>(canvas);
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(false);

  // Initialize canvas virtualization
  const {
    performanceMetrics,
    refreshVirtualization
  } = useVirtualizedCanvas(canvasRef, {
    enabled: options.enableVirtualization ?? true
  });

  const handleCanvasReady = useCallback((canvas: FabricCanvas) => {
    try {
      // Set fabricCanvasRef for external use
      canvasRef.current = canvas;

      // Set up proper tool based on the current drawing mode
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      canvas.selection = tool === DrawingMode.SELECT;

      if (canvas.isDrawingMode) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;

        // Check for enhanced input capabilities
        const hasAdvancedInput = isPressureSupported() || isTiltSupported();

        // Set brush to respond to pressure
        if (hasAdvancedInput) {
          console.log('Enhanced input capabilities detected');
          toast.success('Enhanced drawing capabilities enabled', {
            id: 'enhanced-drawing',
            duration: 3000
          });
        }
      }

      // Create grid for the canvas
      if (true) {
        console.log("Creating grid for canvas");
        const gridObjects = createGrid(canvas);
        gridObjectsRef.current = gridObjects;
      }

      // Make sure touch events work well on mobile
      // Safely access the allowTouchScrolling property
      if ((canvas as any).allowTouchScrolling !== undefined) {
        (canvas as any).allowTouchScrolling = tool === DrawingMode.HAND;
      }

      // Apply custom CSS to the canvas container to make it touch-friendly
      if ((canvas as any).wrapperEl) {
        (canvas as any).wrapperEl.classList.add('touch-manipulation');
        (canvas as any).wrapperEl.style.touchAction = tool === DrawingMode.HAND ? 'manipulation' : 'none';
      }
    } catch (error) {
      console.error("Error in canvas initialization:", error);
    }
  }, [tool, lineColor, lineThickness]);

  // Update grid visibility when showGrid changes
  const updateGridVisibility = useCallback((showGrid: boolean) => {
    const canvas = canvasRef.current;
    if (canvas && gridObjectsRef.current.length > 0) {
      gridObjectsRef.current.forEach(obj => {
        if (obj) {
          obj.set('visible', showGrid);
        }
      });
      canvas.requestRenderAll();
    } else if (canvas && showGrid && gridObjectsRef.current.length === 0) {
      // Create grid if it doesn't exist and should be shown
      const gridObjects = createGrid(canvas);
      gridObjectsRef.current = gridObjects;
    }
  }, []);

  // Update tool settings when they change
  const updateToolSettings = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;

    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }

    canvas.requestRenderAll();
  }, [tool, lineColor, lineThickness]);

  const toggleVirtualization = useCallback(() => {
    setVirtualizationEnabled(prev => !prev);
  }, []);

  return {
    tool,
    setTool,
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness,
    handleCanvasReady,
    updateGridVisibility,
    updateToolSettings,
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization,
    performanceMetrics
  };
};

// Export alias for backward compatibility
export { useCanvasControllerTools as useCanvasToolManager };
