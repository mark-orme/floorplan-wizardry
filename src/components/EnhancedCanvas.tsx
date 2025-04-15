
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useEnhancedSnapToGrid } from '@/hooks/useEnhancedSnapToGrid';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { toast } from 'sonner';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { ZOOM_CONSTANTS } from '@/constants/zoomConstants';
import { forceGridCreationAndVisibility } from '@/utils/grid/gridVisibility';

export interface EnhancedCanvasProps {
  width: number;
  height: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  snapToGrid?: boolean;
  autoStraighten?: boolean;
  onZoomChange?: (zoom: number) => void;
  onUndo?: () => void;
  showGrid?: boolean;
  infiniteCanvas?: boolean;
  paperSize?: { width: number; height: number };
  children?: React.ReactNode;
}

export const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({
  width,
  height,
  onCanvasReady,
  onError,
  tool = DrawingMode.SELECT,
  lineColor = '#000000',
  lineThickness = 2,
  snapToGrid = true,
  autoStraighten = true,
  onZoomChange,
  onUndo,
  showGrid = true,
  infiniteCanvas = false,
  paperSize,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const [viewportTransform, setViewportTransform] = useState<number[] | null>(null);
  
  // Set up enhanced snap to grid
  const { snapEnabled, straightenEnabled, snapPoint, snapLine, toggleSnapToGrid, toggleStraighten } = 
    useEnhancedSnapToGrid({
      fabricCanvasRef,
      initialSnapEnabled: snapToGrid,
      autoStraighten: autoStraighten
    });
  
  // Set up touch gestures
  const { currentZoom, isGestureActive } = useTouchGestures({
    fabricCanvasRef,
    onUndo,
    onZoom: (zoom) => {
      setCanvasZoom(zoom);
      if (onZoomChange) onZoomChange(zoom);
    },
    minZoom: ZOOM_CONSTANTS.MIN_ZOOM,
    maxZoom: ZOOM_CONSTANTS.MAX_ZOOM
  });
  
  // Handle zoom with mouse wheel
  const handleMouseWheel = useCallback((e: WheelEvent) => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    // Prevent default scroll
    e.preventDefault();
    
    // Get mouse position
    const pointer = canvas.getPointer(e);
    
    // Calculate zoom factor
    const delta = e.deltaY;
    const zoomFactor = delta > 0 ? 
      (1 - ZOOM_CONSTANTS.WHEEL_ZOOM_FACTOR) : 
      (1 + ZOOM_CONSTANTS.WHEEL_ZOOM_FACTOR);
    
    // Calculate new zoom level
    let newZoom = canvasZoom * zoomFactor;
    
    // Constrain zoom levels
    newZoom = Math.max(ZOOM_CONSTANTS.MIN_ZOOM, Math.min(ZOOM_CONSTANTS.MAX_ZOOM, newZoom));
    
    // Apply zoom centered on mouse position
    canvas.zoomToPoint({ x: pointer.x, y: pointer.y }, newZoom);
    
    // Update state
    setCanvasZoom(newZoom);
    if (onZoomChange) onZoomChange(newZoom);
    
    // Update viewport transform
    if (canvas.viewportTransform) {
      setViewportTransform([...canvas.viewportTransform]);
    }
    
    // Ensure the grid stays visible
    if (showGrid) {
      forceGridCreationAndVisibility(canvas);
    }
  }, [fabricCanvasRef, canvasZoom, onZoomChange, showGrid]);
  
  // Handle canvas pan with middle mouse or touch
  const handleCanvasPan = useCallback((e: MouseEvent) => {
    if (!fabricCanvasRef.current || e.buttons !== 4) return; // Middle mouse button
    const canvas = fabricCanvasRef.current;
    
    if (!canvas.viewportTransform) return;
    
    canvas.viewportTransform[4] += e.movementX;
    canvas.viewportTransform[5] += e.movementY;
    canvas.requestRenderAll();
    
    setCanvasPan({
      x: canvas.viewportTransform[4],
      y: canvas.viewportTransform[5]
    });
    
    setViewportTransform([...canvas.viewportTransform]);
  }, [fabricCanvasRef]);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || canvasInitialized) return;
    
    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: paperSize?.width || width,
        height: paperSize?.height || height,
        selection: tool === DrawingMode.SELECT,
        backgroundColor: '#ffffff'
      });
      
      fabricCanvasRef.current = canvas;
      setCanvasInitialized(true);
      
      // Set up default canvas properties
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
      
      // Initialize for infinite canvas if enabled
      if (infiniteCanvas) {
        // Set very large dimensions
        canvas.setDimensions({
          width: window.innerWidth * 3,
          height: window.innerHeight * 3
        });
        
        // Center the viewport
        if (canvas.viewportTransform) {
          canvas.viewportTransform[4] = window.innerWidth / 2;
          canvas.viewportTransform[5] = window.innerHeight / 2;
          setViewportTransform([...canvas.viewportTransform]);
        }
      }
      
      // Create initial grid
      if (showGrid) {
        forceGridCreationAndVisibility(canvas);
      }
      
      // Notify parent that canvas is ready
      onCanvasReady(canvas);
      
      // Make canvas global for debugging
      if (typeof window !== 'undefined') {
        (window as any).fabricCanvas = canvas;
      }
      
      toast.success('Canvas initialized successfully');
    } catch (error) {
      console.error('Error initializing canvas:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      toast.error('Failed to initialize canvas');
    }
  }, [canvasRef, canvasInitialized, width, height, tool, lineColor, lineThickness, 
      onCanvasReady, onError, showGrid, infiniteCanvas, paperSize]);
  
  // Handle tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    // Update drawing mode based on selected tool
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    // Update cursor based on tool
    switch (tool) {
      case DrawingMode.DRAW:
      case DrawingMode.LINE:
      case DrawingMode.STRAIGHT_LINE:
      case DrawingMode.WALL:
        canvas.defaultCursor = 'crosshair';
        break;
      case DrawingMode.HAND:
      case DrawingMode.PAN:
        canvas.defaultCursor = 'grab';
        break;
      case DrawingMode.ERASER:
        canvas.defaultCursor = 'cell';
        break;
      case DrawingMode.SELECT:
      default:
        canvas.defaultCursor = 'default';
        break;
    }
    
    // Update brush properties
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    canvas.renderAll();
  }, [tool, lineColor, lineThickness, fabricCanvasRef]);
  
  // Set up mouse wheel zoom
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    
    canvasElement.addEventListener('wheel', handleMouseWheel, { passive: false });
    canvasElement.addEventListener('mousemove', handleCanvasPan);
    
    return () => {
      canvasElement.removeEventListener('wheel', handleMouseWheel);
      canvasElement.removeEventListener('mousemove', handleCanvasPan);
    };
  }, [canvasRef, handleMouseWheel, handleCanvasPan]);
  
  // Update canvas dimensions on window resize or paper size change
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const updateDimensions = () => {
      if (paperSize) {
        canvas.setDimensions(paperSize);
      } else if (infiniteCanvas) {
        canvas.setDimensions({
          width: window.innerWidth * 3,
          height: window.innerHeight * 3
        });
      } else {
        canvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
      
      // Recreate grid after resize
      if (showGrid) {
        forceGridCreationAndVisibility(canvas);
      }
    };
    
    // Update dimensions initially and on resize
    updateDimensions();
    
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [fabricCanvasRef, paperSize, infiniteCanvas, showGrid]);
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="touch-manipulation"
        data-testid="enhanced-canvas"
        data-snap-enabled={snapEnabled.toString()}
        data-straighten-enabled={straightenEnabled.toString()}
        data-zoom={canvasZoom.toFixed(2)}
        data-tool={tool}
      />
      
      {/* Canvas controls could be placed here as an overlay */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        {snapEnabled ? (
          <button 
            onClick={toggleSnapToGrid}
            className="p-2 bg-white/80 rounded-full shadow-md"
            title="Snap to grid enabled (click to disable)"
          >
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </button>
        ) : (
          <button 
            onClick={toggleSnapToGrid}
            className="p-2 bg-white/80 rounded-full shadow-md"
            title="Snap to grid disabled (click to enable)"
          >
            <div className="h-4 w-4 bg-gray-400 rounded-full" />
          </button>
        )}
        
        {straightenEnabled ? (
          <button 
            onClick={toggleStraighten}
            className="p-2 bg-white/80 rounded-full shadow-md"
            title="Auto straighten enabled (click to disable)"
          >
            <div className="h-4 w-4 bg-blue-500 rounded-full" />
          </button>
        ) : (
          <button 
            onClick={toggleStraighten}
            className="p-2 bg-white/80 rounded-full shadow-md"
            title="Auto straighten disabled (click to enable)"
          >
            <div className="h-4 w-4 bg-gray-400 rounded-full" />
          </button>
        )}
      </div>
      
      {/* Zoom indicator */}
      <div className="absolute top-4 right-4 bg-white/80 px-2 py-1 rounded shadow-md text-sm z-10">
        {Math.round(canvasZoom * 100)}%
      </div>
      
      {/* Canvas children */}
      {children}
    </div>
  );
};
