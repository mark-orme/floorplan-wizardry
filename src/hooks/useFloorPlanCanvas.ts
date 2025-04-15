
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject, Path } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Point } from '@/types/core/Point';
import { DrawingLayer } from '@/components/canvas/DrawingLayers';
import { calculateGIA, formatArea } from '@/utils/calculations/internalAreaCalculator';
import { toast } from 'sonner';
import { resetInitializationState } from '@/utils/canvas/safeCanvasInitialization';

interface UseFloorPlanCanvasProps {
  initialTool?: DrawingMode;
  initialLineColor?: string;
  initialLineThickness?: number;
  onCanvasError?: (error: Error) => void;
}

export const useFloorPlanCanvas = ({
  initialTool = DrawingMode.SELECT,
  initialLineColor = '#000000',
  initialLineThickness = 2,
  onCanvasError
}: UseFloorPlanCanvasProps) => {
  // Canvas references
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  // Drawing state
  const [tool, setTool] = useState<DrawingMode>(initialTool);
  const [lineColor, setLineColor] = useState(initialLineColor);
  const [lineThickness, setLineThickness] = useState(initialLineThickness);
  const [canvasZoom, setCanvasZoom] = useState(1);
  
  // Layer management
  const [layers, setLayers] = useState<DrawingLayer[]>([
    {
      id: 'default-layer',
      name: 'Base Layer',
      visible: true,
      locked: false,
      objects: []
    }
  ]);
  const [activeLayerId, setActiveLayerId] = useState('default-layer');
  
  // Area calculation
  const [calculatedArea, setCalculatedArea] = useState<{
    areaM2: number;
    areaSqFt: number;
  }>({ areaM2: 0, areaSqFt: 0 });
  
  // Handle canvas ready
  const handleCanvasReady = useCallback((canvas: FabricCanvas) => {
    fabricCanvasRef.current = canvas;
    
    // Add canvas objects event handlers for layer management
    canvas.on('object:added', (e) => {
      if (!e.target) return;
      
      // Add the object to the active layer
      setLayers(prevLayers => 
        prevLayers.map(layer => {
          if (layer.id === activeLayerId) {
            return {
              ...layer,
              objects: [...layer.objects, e.target as FabricObject]
            };
          }
          return layer;
        })
      );
    });
    
    // Handle object removal
    canvas.on('object:removed', (e) => {
      if (!e.target) return;
      
      // Remove the object from its layer
      setLayers(prevLayers => 
        prevLayers.map(layer => {
          return {
            ...layer,
            objects: layer.objects.filter(obj => obj !== e.target)
          };
        })
      );
    });
    
    // Initialize with the default layer
    toast.success('Canvas ready. Start creating your floor plan!');
  }, [activeLayerId]);
  
  // Handle canvas error
  const handleCanvasError = useCallback((error: Error) => {
    console.error('Canvas error:', error);
    toast.error(`Canvas error: ${error.message}`);
    
    if (onCanvasError) {
      onCanvasError(error);
    }
  }, [onCanvasError]);
  
  // Handle undo
  const handleUndo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    try {
      // For now, just remove the last added object
      const objects = canvas.getObjects();
      if (objects.length > 0) {
        canvas.remove(objects[objects.length - 1]);
        toast.info('Undo');
      }
    } catch (error) {
      console.error('Error during undo:', error);
      toast.error('Failed to undo');
    }
  }, []);
  
  // Calculate area for the current floor plan
  const calculateArea = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Collect all rooms (closed polygons) from the canvas
    const rooms: {
      id: string;
      points: Point[];
      type: 'internal' | 'external' | 'excluded';
    }[] = [];
    
    // For now, we'll assume all closed paths are internal rooms
    canvas.getObjects().forEach((obj, index) => {
      if (obj.type === 'path') {
        const path = obj as Path;
        // Check if the path is closed by examining its path data
        const pathData = path.path;
        let isClosed = false;
        
        if (pathData && pathData.length > 2) {
          // A path is considered closed if the last point connects back to the first point
          const firstCommand = pathData[0];
          const lastCommand = pathData[pathData.length - 1];
          
          if (firstCommand[0] === 'M' && 
             (lastCommand[0] === 'Z' || 
             (lastCommand[0] === 'L' && lastCommand[1] === firstCommand[1] && lastCommand[2] === firstCommand[2]))) {
            isClosed = true;
          }
        }
        
        if (isClosed) {
          const points: Point[] = [];
          
          if (pathData) {
            for (let i = 0; i < pathData.length; i++) {
              const cmd = pathData[i];
              if (cmd[0] === 'M' || cmd[0] === 'L') {
                points.push({ x: cmd[1], y: cmd[2] });
              }
            }
          }
          
          if (points.length > 2) {
            rooms.push({
              id: `room-${index}`,
              points,
              type: 'internal' // Assuming all are internal for now
            });
          }
        }
      }
    });
    
    // Calculate GIA
    const result = calculateGIA(rooms);
    if (result.isValid) {
      setCalculatedArea({
        areaM2: result.areaM2,
        areaSqFt: result.areaSqFt
      });
      
      toast.success(`Calculated area: ${formatArea(result.areaM2)}`);
    } else {
      toast.error(`Failed to calculate area: ${result.errorMessage}`);
    }
  }, []);
  
  // Reset canvas initialization when component mounts
  useEffect(() => {
    resetInitializationState();
    return () => {
      // Clean up canvas on unmount
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);
  
  // Log debugging information for straight line tool
  useEffect(() => {
    if (tool === DrawingMode.STRAIGHT_LINE) {
      console.log("Straight line tool activated in FloorPlanCanvasEnhanced");
    }
  }, [tool]);
  
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
    calculateArea
  };
};
