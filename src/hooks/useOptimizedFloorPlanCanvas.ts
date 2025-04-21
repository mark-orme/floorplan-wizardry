
import { useCallback, useState, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useVirtualizedCanvas, VirtualizationPerformanceMetrics } from './useVirtualizedCanvas';
import { useCanvasToolManager } from './canvas/useCanvasToolManager';
import { useAreaCalculation } from './canvas/useAreaCalculation';
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
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [tool, setTool] = useState<DrawingMode>(initialTool);
  const [lineColor, setLineColor] = useState<string>(initialLineColor);
  const [lineThickness, setLineThickness] = useState<number>(initialLineThickness);
  const [canvasZoom, setCanvasZoom] = useState<number>(1);
  const [layers, setLayers] = useState([{ id: 'default', name: 'Default Layer', visible: true }]);
  const [activeLayerId, setActiveLayerId] = useState('default');
  const [calculatedArea, setCalculatedArea] = useState({ areaM2: 0 });

  const { performanceMetrics, refreshVirtualization } = useVirtualizedCanvas(
    fabricCanvasRef,
    { enabled: true }
  );

  const { configureToolSettings } = useCanvasToolManager({
    canvas: fabricCanvasRef.current,
    tool,
    lineColor,
    lineThickness
  });

  const { calculateArea } = useAreaCalculation(fabricCanvasRef.current);

  const handleCanvasReady = useCallback((canvas: FabricCanvas) => {
    fabricCanvasRef.current = canvas;
    canvas.renderOnAddRemove = false;
    canvas.enableRetinaScaling = true;
    canvas.skipOffscreen = true;
    configureToolSettings();
    refreshVirtualization();
  }, [configureToolSettings, refreshVirtualization]);

  const handleCanvasError = useCallback((error: Error) => {
    console.error("Canvas error:", error);
    onCanvasError?.(error);
    toast.error(`Canvas error: ${error.message}`);
  }, [onCanvasError]);

  const handleCalculateArea = useCallback(async () => {
    const result = await calculateArea();
    setCalculatedArea(result);
  }, [calculateArea]);

  const syncCanvasToBackend = useCallback(async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      const canvasJson = canvas.toJSON(['id', 'name', 'layerId', 'selectable']);
      const { data, transferables } = createTransferableCanvasState(canvasJson);
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
    calculateArea: handleCalculateArea,
    syncCanvasToBackend,
    performanceMetrics,
    refreshVirtualization
  };
};
