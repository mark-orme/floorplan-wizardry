
/**
 * Canvas Component
 * Primary canvas component for fabric.js rendering
 * @module Canvas
 */
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, PencilBrush } from 'fabric';
import { toast } from 'sonner';
import { initializeCanvasGestures, isIOSPlatform } from '@/utils/fabric';
import { CanvasCreationOptions } from '@/types/fabric';
import { CANVAS_STYLES, CANVAS_SCALING } from '@/constants/canvas';
import { DistanceTooltip } from './DistanceTooltip';
import { useCanvasInteractions } from '@/hooks/useCanvasInteractions';
import { useCanvasController } from './canvas/controller/CanvasController';
import { createCompleteGrid } from '@/utils/grid/gridCreation';

/**
 * Canvas component props interface
 * @interface CanvasProps
 */
interface CanvasProps {
  /** Callback triggered when canvas fails to initialize */
  onError?: () => void;
  
  /** Canvas width in pixels */
  width?: number;
  
  /** Canvas height in pixels */
  height?: number;
  
  /** Callback triggered when canvas is successfully initialized */
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

/**
 * Canvas component that handles fabric.js canvas rendering
 * Provides a responsive drawing surface with touch capabilities
 * 
 * @param {CanvasProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const Canvas: React.FC<CanvasProps> = ({ 
  onError, 
  width = CANVAS_SCALING.DEFAULT_WIDTH,
  height = CANVAS_SCALING.DEFAULT_HEIGHT,
  onCanvasReady 
}) => {
  // Reference to the HTML canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Reference to the Fabric.js canvas instance
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  // Track if grid has been initialized
  const gridInitializedRef = useRef<boolean>(false);
  
  // Get current tool from canvas controller if available
  const { tool, lineThickness, lineColor } = useCanvasController();
  
  // Initialize canvas interactions for drawing
  const {
    drawingState,
    currentZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isSnappedToGrid,
    isLineAutoStraightened,
    toggleSnap,
    snapEnabled
  } = useCanvasInteractions({
    fabricCanvasRef,
    tool,
    lineThickness,
    lineColor
  });
  
  // Detect iOS devices to apply platform-specific optimizations
  const isIOS = isIOSPlatform();
  
  // Initialize grid once canvas is ready
  const initializeGrid = (canvas: FabricCanvas) => {
    if (!gridInitializedRef.current && canvas) {
      console.log("Initializing grid on canvas");
      try {
        const gridResult = createCompleteGrid(canvas, width, height);
        console.log(`Grid created with ${gridResult.allGrid.length} objects (${gridResult.smallGrid.length} small, ${gridResult.largeGrid.length} large)`);
        gridInitializedRef.current = true;
      } catch (error) {
        console.error("Error creating grid:", error);
        toast.error("Failed to create grid");
      }
    }
  };
  
  // Initialize fabric.js canvas when the HTML canvas is available
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      console.log("Canvas: Creating Fabric.js instance");
      
      // Create canvas options with iOS-specific adjustments
      const canvasOptions: CanvasCreationOptions = {
        width,
        height,
        backgroundColor: CANVAS_STYLES.BACKGROUND_COLOR,
        enableRetinaScaling: !isIOS, // Disable for iOS to improve performance
        stopContextMenu: true,        // Prevent context menu on right-click
        fireRightClick: false,        // Disable right-click events
        renderOnAddRemove: true,      // Enable immediate rendering to fix grid visibility
      };
      
      // Add iOS-specific options to improve touch handling
      if (isIOS) {
        Object.assign(canvasOptions, {
          enablePointerEvents: true,              // Enable pointer events on iOS
          skipTargetFind: false,                  // Don't skip target finding
          perPixelTargetFind: false,              // Disable per-pixel target finding (performance)
          targetFindTolerance: CANVAS_SCALING.IOS_TOUCH_TOLERANCE, // Larger hit areas for fingers
          interactive: true                       // Ensure interactions work
        });
      }
      
      // Create the Fabric.js canvas instance
      const canvas = new FabricCanvas(canvasRef.current, canvasOptions);
      
      // Initialize the drawing brush (required for drawing mode)
      if (!canvas.freeDrawingBrush || !(canvas.freeDrawingBrush instanceof PencilBrush)) {
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.color = lineColor || '#000000';
        canvas.freeDrawingBrush.width = lineThickness || 2;
        console.log("Drawing brush initialized:", {
          color: canvas.freeDrawingBrush.color,
          width: canvas.freeDrawingBrush.width
        });
      }
      
      // Initialize multi-touch gestures support
      initializeCanvasGestures(canvas);
      
      // Store reference to the canvas
      fabricCanvasRef.current = canvas;
      
      // Setup interactive mode based on current tool
      if (tool === 'draw') {
        canvas.isDrawingMode = true;
        console.log("Setting drawing mode to true for draw tool");
      } else {
        canvas.isDrawingMode = false;
      }
      
      // Register mouse/touch event handlers for drawing
      canvas.on('mouse:down', (e: any) => {
        console.log("Canvas mouse down event", { tool, isDrawingMode: canvas.isDrawingMode });
        handleMouseDown(e.e);
      });
      
      canvas.on('mouse:move', (e: any) => {
        handleMouseMove(e.e);
      });
      
      canvas.on('mouse:up', (e: any) => {
        console.log("Canvas mouse up event", { tool, isDrawingMode: canvas.isDrawingMode });
        handleMouseUp(e.e);
      });
      
      // Initialize grid after canvas is ready
      initializeGrid(canvas);
      
      // Notify parent that canvas is ready
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      // Render the canvas to ensure all objects are visible
      canvas.requestRenderAll();
      
      // Log canvas initialization success
      console.log("Canvas successfully initialized with dimensions:", { width, height });
      
      // Cleanup function to dispose canvas on unmount
      return () => {
        try {
          // Remove event listeners
          canvas.off('mouse:down');
          canvas.off('mouse:move');
          canvas.off('mouse:up');
          
          // Dispose canvas
          canvas.dispose();
          fabricCanvasRef.current = null;
          gridInitializedRef.current = false;
        } catch (error) {
          console.error("Error disposing canvas:", error);
        }
      };
    } catch (error) {
      console.error("Failed to initialize canvas:", error);
      
      // Notify parent of initialization failure
      if (onError) {
        onError();
      }
      
      // Show error toast to the user
      toast.error("Failed to initialize canvas. Please refresh the page.");
    }
  }, [width, height, isIOS, onCanvasReady, onError, handleMouseDown, handleMouseMove, handleMouseUp, lineColor, lineThickness, tool]);
  
  // Update brush settings when tool, color or thickness changes
  useEffect(() => {
    if (!fabricCanvasRef.current || !fabricCanvasRef.current.freeDrawingBrush) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Set drawing mode based on tool
    canvas.isDrawingMode = tool === 'draw';
    
    // Update brush color and width
    canvas.freeDrawingBrush.color = lineColor || '#000000';
    canvas.freeDrawingBrush.width = lineThickness || 2;
    
    console.log(`Tool changed to ${tool}, drawing mode: ${canvas.isDrawingMode}`, {
      brushColor: canvas.freeDrawingBrush.color,
      brushWidth: canvas.freeDrawingBrush.width
    });
    
    // Force render to apply changes
    canvas.requestRenderAll();
  }, [tool, lineColor, lineThickness]);
  
  return (
    <>
      <canvas 
        ref={canvasRef}
        data-testid="canvas-element"
        className={CANVAS_STYLES.WRAPPER_CLASS}
        style={{ border: CANVAS_STYLES.BORDER }}
      />
      
      <div className="absolute top-2 right-2 bg-white/80 p-2 rounded shadow text-xs">
        <div>Current tool: {tool}</div>
        <div>Snap to grid: {snapEnabled ? 'On' : 'Off'}</div>
        <button 
          className="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs"
          onClick={() => toggleSnap()}
        >
          Toggle Snap
        </button>
      </div>
      
      {/* Distance tooltip for measurements */}
      <DistanceTooltip
        startPoint={drawingState.startPoint}
        currentPoint={drawingState.currentPoint}
        midPoint={drawingState.midPoint}
        isVisible={Boolean(drawingState.startPoint && drawingState.currentPoint && (tool === 'straightLine' || tool === 'wall'))}
        currentZoom={currentZoom}
        isSnappedToGrid={isSnappedToGrid(drawingState.currentPoint)}
        isAutoStraightened={isLineAutoStraightened(drawingState.startPoint, drawingState.currentPoint)}
      />
    </>
  );
};
