
/**
 * Canvas application component
 * Main component that wraps the canvas with necessary UI elements
 * @module CanvasApp
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Canvas } from "@/components/Canvas";
import CanvasLayout from "@/components/CanvasLayout"; 
import { DrawingToolbarModals } from "@/components/DrawingToolbarModals";
import { DEFAULT_DEBUG_STATE } from "@/types/core/DebugInfo";
import type { DebugInfoState } from "@/types/core/DebugInfo";
import { Canvas as FabricCanvas } from "fabric";
import { forceGridCreationAndVisibility } from "@/utils/grid/gridVisibility";
import { toast } from "sonner";
import { DrawingToolbar } from "@/components/canvas/DrawingToolbar";
import { DrawingMode } from "@/constants/drawingModes";

// Default dimensions for the canvas - use window dimensions for responsive behavior
const getDefaultCanvasDimensions = () => ({
  width: Math.max(window.innerWidth - 40, 800),
  height: Math.max(window.innerHeight - 100, 600)
});

interface CanvasAppProps {
  setCanvas?: (canvas: FabricCanvas | null) => void;
  showGridDebug?: boolean;
}

/**
 * Canvas application component
 * Wraps the canvas with necessary controllers and UI
 * @returns {JSX.Element} Rendered component
 */
export const CanvasApp = ({ setCanvas, showGridDebug = false }: CanvasAppProps): JSX.Element => {
  const [canvasDimensions, setCanvasDimensions] = useState(getDefaultCanvasDimensions());
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>(() => ({
    ...DEFAULT_DEBUG_STATE,
    hasError: false,
    errorMessage: '',
    lastInitTime: Date.now(),
    lastGridCreationTime: 0,
    canvasEventsRegistered: false,
    gridRendered: false,
    toolsInitialized: false
  }));
  
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [wallColor, setWallColor] = useState<string>('#333333');
  const [wallThickness, setWallThickness] = useState<number>(4);
  
  const canvasRef = useRef<FabricCanvas | null>(null);
  const mountedRef = useRef<boolean>(true);
  const [key, setKey] = useState<number>(0);
  
  // Update canvas dimensions when window resizes
  useEffect(() => {
    const handleResize = () => {
      setCanvasDimensions(getDefaultCanvasDimensions());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Stable handler for canvas ready event
  const handleCanvasReady = useCallback((canvas: FabricCanvas) => {
    if (!mountedRef.current) return;
    
    // Save canvas reference locally
    canvasRef.current = canvas;
    
    // Update parent component with canvas reference
    if (setCanvas) {
      setCanvas(canvas);
    }
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      canvasReady: true,
      canvasInitialized: true,
      dimensionsSet: true
    }));
    
    // Force grid creation after a short delay
    setTimeout(() => {
      if (mountedRef.current && canvas) {
        forceGridCreationAndVisibility(canvas);
        canvas.renderAll();
        toast.success("Canvas initialized");
      }
    }, 1000);
  }, [setCanvas]);
  
  // Reset canvas on error
  const resetCanvas = useCallback(() => {
    setKey(prev => prev + 1);
    
    setTimeout(() => {
      if (canvasRef.current) {
        forceGridCreationAndVisibility(canvasRef.current);
      }
    }, 500);
  }, []);
  
  // Handle tool change
  const handleToolChange = useCallback((tool: DrawingMode) => {
    setActiveTool(tool);
    
    if (canvasRef.current) {
      // Apply tool settings to canvas
      const canvas = canvasRef.current;
      
      switch (tool) {
        case DrawingMode.DRAW:
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush.width = lineThickness;
          canvas.freeDrawingBrush.color = lineColor;
          break;
        case DrawingMode.SELECT:
          canvas.isDrawingMode = false;
          canvas.selection = true;
          break;
        case DrawingMode.WALL:
          canvas.isDrawingMode = false;
          canvas.selection = false;
          break;
        case DrawingMode.STRAIGHT_LINE:
          canvas.isDrawingMode = false;
          canvas.selection = false;
          break;
        default:
          canvas.isDrawingMode = false;
          break;
      }
      
      canvas.renderAll();
      toast.success(`Switched to ${tool} tool`);
    }
  }, [lineColor, lineThickness, wallColor, wallThickness]);
  
  // Clean up on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      
      // Clear parent canvas reference on unmount
      if (setCanvas) {
        setCanvas(null);
      }
    };
  }, [setCanvas]);
  
  return (
    <CanvasLayout>
      <Canvas 
        key={`canvas-${key}`}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        onCanvasReady={handleCanvasReady}
        setDebugInfo={setDebugInfo}
        showGridDebug={showGridDebug}
        tool={activeTool}
        lineColor={lineColor}
        lineThickness={lineThickness}
        wallColor={wallColor}
        wallThickness={wallThickness}
      />
      <div className="absolute top-4 left-4 z-10">
        <DrawingToolbar 
          activeTool={activeTool} 
          onToolChange={handleToolChange}
          lineColor={lineColor}
          lineThickness={lineThickness}
          wallColor={wallColor}
          wallThickness={wallThickness}
          onLineColorChange={setLineColor}
          onLineThicknessChange={setLineThickness}
          onWallColorChange={setWallColor}
          onWallThicknessChange={setWallThickness}
        />
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow-md"
          onClick={resetCanvas}
        >
          Reset Canvas
        </button>
      </div>
      <DrawingToolbarModals />
    </CanvasLayout>
  );
};
