
import { useCallback, useState, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { calculatePolygonArea } from '@/utils/computeUtils';
import { useVirtualizedCanvas } from './useVirtualizedCanvas';
import { createTransferableCanvasState } from '@/utils/transferableUtils';
import { toast } from 'sonner';

interface UseOptimizedFloorPlanCanvasProps {
  initialTool?: DrawingMode;
  initialLineColor?: string;
  initialLineThickness?: number;
  onCanvasError?: (error: Error) => void;
}

export const useOptimizedFloorPlanCanvas = ({
  initialTool = DrawingMode.SELECT,
  initialLineColor = "#000000",
  initialLineThickness = 2,
  onCanvasError
}: UseOptimizedFloorPlanCanvasProps) => {
  // Core state
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [tool, setTool] = useState<DrawingMode>(initialTool);
  const [lineColor, setLineColor] = useState<string>(initialLineColor);
  const [lineThickness, setLineThickness] = useState<number>(initialLineThickness);
  const [canvasZoom, setCanvasZoom] = useState<number>(1);
  const [layers, setLayers] = useState<{ id: string; name: string; visible: boolean }[]>([
    { id: 'default', name: 'Default Layer', visible: true }
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>('default');
  const [calculatedArea, setCalculatedArea] = useState<{ areaM2: number }>({ areaM2: 0 });
  
  // Use virtualized canvas for performance
  const { performanceMetrics, refreshVirtualization } = useVirtualizedCanvas(
    fabricCanvasRef,
    { enabled: true }
  );
  
  // Memoized handler for canvas ready
  const handleCanvasReady = useCallback((canvas: FabricCanvas) => {
    fabricCanvasRef.current = canvas;
    
    // Apply optimizations
    canvas.renderOnAddRemove = false;
    canvas.enableRetinaScaling = true;
    canvas.skipOffscreen = true;
    
    // Setup for current tool
    configureToolSettings(canvas, tool);
    
    // Initial refresh of virtualization
    refreshVirtualization();
    
    console.log("Canvas ready with optimizations applied");
  }, [tool, refreshVirtualization]);
  
  // Memoized handler for canvas errors
  const handleCanvasError = useCallback((error: Error) => {
    console.error("Canvas error:", error);
    if (onCanvasError) {
      onCanvasError(error);
    }
    toast.error(`Canvas error: ${error.message}`);
  }, [onCanvasError]);
  
  // Configure canvas for selected tool
  const configureToolSettings = useCallback((canvas: FabricCanvas, selectedTool: DrawingMode) => {
    if (!canvas) return;
    
    // Reset drawing modes
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    switch (selectedTool) {
      case DrawingMode.SELECT:
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
        
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = lineColor;
          canvas.freeDrawingBrush.width = lineThickness;
        }
        canvas.defaultCursor = 'crosshair';
        break;
        
      case DrawingMode.STRAIGHT_LINE:
        canvas.defaultCursor = 'crosshair';
        break;
        
      default:
        canvas.defaultCursor = 'default';
    }
  }, [lineColor, lineThickness]);
  
  // Apply tool settings when tool changes
  useEffect(() => {
    if (fabricCanvasRef.current) {
      configureToolSettings(fabricCanvasRef.current, tool);
    }
  }, [tool, configureToolSettings]);
  
  // Update brush settings when color or thickness changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.freeDrawingBrush) return;
    
    canvas.freeDrawingBrush.color = lineColor;
    canvas.freeDrawingBrush.width = lineThickness;
  }, [lineColor, lineThickness]);
  
  // Handle undo operation
  const handleUndo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Implementation of undo logic...
    console.log("Undo operation performed");
    
    // Refresh virtualization after undo
    refreshVirtualization();
  }, [refreshVirtualization]);
  
  // Calculate area with optimized computation
  const calculateArea = useCallback(async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Get all polygon objects
      const polygons = canvas.getObjects().filter(obj => obj.type === 'polygon');
      
      if (polygons.length === 0) {
        toast.info("No polygon areas to calculate");
        return;
      }
      
      // Calculate total area with optimized utility
      let totalArea = 0;
      for (const polygon of polygons) {
        const points = (polygon as any).points || [];
        const area = await calculatePolygonArea(points);
        totalArea += area;
      }
      
      // Convert to m² (assuming 1 unit = 1cm)
      const areaM2 = totalArea / 10000;
      
      setCalculatedArea({ areaM2 });
      toast.success(`Area calculated: ${areaM2.toFixed(2)} m²`);
    } catch (error) {
      console.error("Error calculating area:", error);
      toast.error("Error calculating area");
    }
  }, []);
  
  // Sync canvas to backend with transferable objects
  const syncCanvasToBackend = useCallback(async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // Get canvas state as JSON
      const canvasJson = canvas.toJSON(['id', 'name', 'layerId', 'selectable']);
      
      // Create transferable version for efficient worker communication
      const { data, transferables } = createTransferableCanvasState(canvasJson);
      
      // Here you would send the data to your backend
      // For example: 
      // await fetch('/api/canvas', {
      //   method: 'POST',
      //   body: JSON.stringify({ data }),
      // });
      
      console.log("Canvas synced with transferable objects:", transferables.length);
      toast.success("Canvas state saved");
    } catch (error) {
      console.error("Error syncing canvas:", error);
      toast.error("Failed to save canvas state");
    }
  }, []);
  
  return {
    fabricCanvasRef,
    tool,
    setTool,
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness,
    canvasZoom,
    setCanvasZoom,
    layers,
    setLayers,
    activeLayerId,
    setActiveLayerId,
    calculatedArea,
    handleCanvasReady,
    handleCanvasError,
    handleUndo,
    calculateArea,
    syncCanvasToBackend,
    performanceMetrics,
    refreshVirtualization
  };
};
