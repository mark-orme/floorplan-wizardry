/**
 * Hook to manage canvas tools and optimizations
 */
import { useCallback, useState, useEffect, useMemo } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useVirtualizedCanvas } from './useVirtualizedCanvas';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseCanvasControllerToolsProps {
  canvasRef: React.MutableRefObject<FabricCanvas | null>;
  initialTool?: DrawingMode;
}

export function useCanvasControllerTools({
  canvasRef,
  initialTool = DrawingMode.SELECT
}: UseCanvasControllerToolsProps) {
  const [currentTool, setCurrentTool] = useState<DrawingMode>(initialTool);
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [gridEnabled, setGridEnabled] = useState<boolean>(true);
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState<boolean>(false);
  
  // Use virtualized canvas for performance
  const {
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization,
    performanceMetrics
  } = useVirtualizedCanvas(canvasRef, {
    enabled: true,
    autoToggle: true,
    autoToggleThreshold: 100,
    paddingPx: 300
  });
  
  // Configure the canvas based on the current tool
  const configureTool = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Configure canvas properties based on tool
    switch (currentTool) {
      case DrawingMode.SELECT:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        
        // Make objects selectable
        canvas.forEachObject(obj => {
          if (!(obj as any).isGrid) {
            obj.selectable = true;
          }
        });
        break;
        
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        canvas.selection = false;
        
        // Configure brush
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        }
        break;
        
      case DrawingMode.HAND:
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'grab';
        canvas.hoverCursor = 'grab';
        
        // Make objects non-selectable
        canvas.forEachObject(obj => {
          obj.selectable = false;
        });
        break;
        
      default:
        // Other tools
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;
    }
    
    // Refresh canvas
    canvas.requestRenderAll();
    
    // Log tool change
    logger.info(`Tool changed to ${currentTool}`);
    
  }, [canvasRef, currentTool, lineColor, lineThickness]);
  
  // Update tool when it changes
  useEffect(() => {
    configureTool();
  }, [currentTool, lineColor, lineThickness, configureTool]);
  
  // Handle tool change
  const changeTool = useCallback((tool: DrawingMode) => {
    setCurrentTool(tool);
    
    // Refresh virtualization when tool changes
    if (canvasRef.current) {
      refreshVirtualization();
    }
    
    // Notify user of tool change
    toast.info(`Tool: ${tool}`);
  }, [canvasRef, refreshVirtualization]);
  
  // Toggle grid visibility
  const toggleGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setGridEnabled(prev => {
      const newState = !prev;
      
      // Update grid objects visibility
      canvas.forEachObject(obj => {
        if ((obj as any).isGrid) {
          obj.visible = newState;
        }
      });
      
      canvas.requestRenderAll();
      return newState;
    });
  }, [canvasRef]);
  
  // Toggle performance metrics display
  const togglePerformanceMetrics = useCallback(() => {
    setShowPerformanceMetrics(prev => !prev);
  }, []);
  
  // Prepare performance data for display
  const performanceData = useMemo(() => ({
    fps: performanceMetrics?.fps || 0,
    objectCount: performanceMetrics?.objectCount || 0,
    visibleObjects: performanceMetrics?.visibleObjectCount || 0,
    virtualizationEnabled
  }), [performanceMetrics, virtualizationEnabled]);
  
  return {
    currentTool,
    changeTool,
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness,
    gridEnabled,
    toggleGrid,
    virtualizationEnabled,
    toggleVirtualization,
    showPerformanceMetrics,
    togglePerformanceMetrics,
    performanceData,
    configureTool
  };
}
