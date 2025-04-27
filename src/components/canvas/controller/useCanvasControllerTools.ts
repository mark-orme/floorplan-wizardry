/**
 * Hook for managing canvas tools and interactions
 */
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { createSimpleGrid, ensureGridVisible } from '@/utils/simpleGridCreator';
import { isPressureSupported, isTiltSupported } from '@/utils/canvas/pointerEvents';
import { toast } from 'sonner';
import { useVirtualizedCanvas } from '@/hooks/useVirtualizedCanvas';

interface CanvasControllerToolsOptions {
  enableVirtualization?: boolean;
}

// Renamed from useCanvasControllerTools to avoid conflict
export const useCanvasToolManager = (canvas: FabricCanvas | null, options: CanvasControllerToolsOptions = {}) => {
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState<string>("#000000");
  const [lineThickness, setLineThickness] = useState<number>(2);
  const gridObjectsRef = useRef<any[]>([]);
  const canvasRef = useRef<FabricCanvas | null>(canvas);

  // Initialize canvas virtualization
  const {
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization,
    performanceMetrics
  } = useVirtualizedCanvas(canvasRef, {
    enabled: options.enableVirtualization ?? true,
    objectThreshold: 100
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
        const gridObjects = createSimpleGrid(canvas, 50, '#e0e0e0');
        gridObjectsRef.current = gridObjects;
      }

      // Make sure touch events work well on mobile
      canvas.allowTouchScrolling = tool === DrawingMode.HAND;

      // Apply custom CSS to the canvas container to make it touch-friendly
      if (canvas.wrapperEl) {
        canvas.wrapperEl.classList.add('touch-manipulation');
        canvas.wrapperEl.style.touchAction = tool === DrawingMode.HAND ? 'manipulation' : 'none';
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
        obj.set('visible', showGrid);
      });
      canvas.requestRenderAll();
    } else if (canvas && showGrid && gridObjectsRef.current.length === 0) {
      // Create grid if it doesn't exist and should be shown
      const gridObjects = createSimpleGrid(canvas, 50, '#e0e0e0');
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

// Export the renamed function to avoid conflicts
export { useCanvasToolManager as useCanvasControllerTools };
