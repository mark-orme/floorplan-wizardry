
import React, { useRef, useState, useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric"; 
import { EnhancedCanvas } from "@/components/EnhancedCanvas";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { useEnhancedSnapToGrid } from "@/hooks/useEnhancedSnapToGrid";
import { useTouchGestures } from "@/hooks/useTouchGestures";
import { usePaperSizeManager } from "@/hooks/usePaperSizeManager";
import { DrawingLayers, DrawingLayer } from "@/components/canvas/DrawingLayers";
import { calculateGIA, formatArea } from "@/utils/calculations/internalAreaCalculator";
import { toast } from "sonner";
import { DrawingMode } from "@/constants/drawingModes";
import { PaperSizeSelector } from "@/components/canvas/PaperSizeSelector";

interface FloorPlanCanvasEnhancedProps {
  /** Callback for canvas error */
  onCanvasError?: (error: Error) => void;
  /** Initial tool */
  initialTool?: DrawingMode;
  /** Initial line color */
  initialLineColor?: string;
  /** Initial line thickness */
  initialLineThickness?: number;
  /** Whether to show grid */
  showGrid?: boolean;
}

export const FloorPlanCanvasEnhanced: React.FC<FloorPlanCanvasEnhancedProps> = ({
  onCanvasError,
  initialTool = DrawingMode.SELECT,
  initialLineColor = "#000000",
  initialLineThickness = 2,
  showGrid = true
}) => {
  // Canvas references
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Use hooks
  const { currentPaperSize, paperSizes, infiniteCanvas, changePaperSize, toggleInfiniteCanvas } = 
    usePaperSizeManager({ fabricCanvasRef });
  
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
  }, [fabricCanvasRef]);
  
  // Calculate area for the current floor plan
  const calculateArea = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Collect all rooms (closed polygons) from the canvas
    const rooms: {
      id: string;
      points: { x: number; y: number }[];
      type: 'internal' | 'external' | 'excluded';
    }[] = [];
    
    // For now, we'll assume all closed paths are internal rooms
    // This would need to be enhanced based on your layer types and object metadata
    canvas.getObjects('path').forEach((path, index) => {
      if (path.closed) {
        const points = [];
        const pathData = path.path;
        
        // Extract points from path data
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
  }, [fabricCanvasRef]);
  
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
  
  return (
    <div 
      ref={canvasContainerRef}
      className="h-full w-full relative overflow-hidden"
      data-testid="enhanced-floor-plan-wrapper"
    >
      <CanvasControllerProvider>
        <EnhancedCanvas
          width={currentPaperSize.width}
          height={currentPaperSize.height}
          onCanvasReady={handleCanvasReady}
          onError={handleCanvasError}
          tool={tool}
          lineColor={lineColor}
          lineThickness={lineThickness}
          snapToGrid={true}
          autoStraighten={true}
          onZoomChange={setCanvasZoom}
          onUndo={handleUndo}
          showGrid={showGrid}
          infiniteCanvas={infiniteCanvas}
          paperSize={infiniteCanvas ? undefined : currentPaperSize}
        />
        
        {/* Layer management */}
        <DrawingLayers
          fabricCanvasRef={fabricCanvasRef}
          layers={layers}
          setLayers={setLayers}
          activeLayerId={activeLayerId}
          setActiveLayerId={setActiveLayerId}
        />
        
        {/* Area calculation display */}
        {calculatedArea.areaM2 > 0 && (
          <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded shadow-md z-10">
            <h3 className="text-sm font-medium">Gross Internal Area</h3>
            <p className="text-sm">{formatArea(calculatedArea.areaM2)}</p>
          </div>
        )}
        
        {/* Paper size controls */}
        <PaperSizeSelector
          currentPaperSize={currentPaperSize}
          paperSizes={paperSizes}
          infiniteCanvas={infiniteCanvas}
          onChangePaperSize={changePaperSize}
          onToggleInfiniteCanvas={toggleInfiniteCanvas}
        />
        
        {/* Calculate Area button */}
        <button
          className="absolute bottom-4 right-4 bg-white rounded-md shadow-md px-3 py-1 text-sm font-medium z-10"
          onClick={calculateArea}
        >
          Calculate Area
        </button>
      </CanvasControllerProvider>
    </div>
  );
};
