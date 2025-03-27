
/**
 * Canvas Component
 * Primary canvas component for fabric.js rendering
 * @module Canvas
 */
import React, { useEffect, useRef, useState } from 'react';
import { useCanvasInit } from '@/hooks/useCanvasInit';
import { Canvas as FabricCanvas, PencilBrush } from 'fabric';
import { toast } from 'sonner';
import { useReliableGridInitialization } from '@/hooks/useReliableGridInitialization';
import { initializeCanvasGestures, isIOSPlatform } from '@/utils/fabric';
import { CanvasCreationOptions } from '@/types/fabric';
import { CANVAS_STYLES, CANVAS_SCALING } from '@/constants/canvas';
import { DistanceTooltip } from './DistanceTooltip';
import { useCanvasInteractions } from '@/hooks/useCanvasInteractions';
import { useCanvasController } from './canvas/controller/CanvasController';
import { createCompleteGrid, setGridVisibility } from '@/utils/gridUtils';

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
    isAutoStraightened
  } = useCanvasInteractions({
    fabricCanvasRef,
    tool,
    lineThickness,
    lineColor
  });
  
  // Detect iOS devices to apply platform-specific optimizations
  // iOS requires special handling for touch events and performance
  const isIOS = isIOSPlatform();
  
  // Initialize grid once canvas is ready
  const initializeGrid = (canvas: FabricCanvas) => {
    if (!gridInitializedRef.current && canvas) {
      console.log("Initializing grid on canvas");
      const gridObjects = createCompleteGrid(canvas, width, height);
      setGridVisibility(canvas, true);
      gridInitializedRef.current = true;
      console.log(`Grid created with ${gridObjects.gridObjects.length} objects`);
    }
  };
  
  // Initialize fabric.js canvas when the HTML canvas is available
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      console.log("Canvas: Creating Fabric.js instance");
      
      // Create canvas options with iOS-specific adjustments
      // iOS devices need special touch handling and performance optimizations
      const canvasOptions: CanvasCreationOptions = {
        width,
        height,
        backgroundColor: CANVAS_STYLES.BACKGROUND_COLOR,
        enableRetinaScaling: !isIOS, // Disable for iOS to improve performance
        stopContextMenu: true,        // Prevent context menu on right-click
        fireRightClick: false,        // Disable right-click events
        renderOnAddRemove: false,     // Defer rendering until explicitly requested
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
      }
      
      // Enable rendering now that initialization is complete
      canvas.renderOnAddRemove = true;
      
      // Initialize multi-touch gestures support
      initializeCanvasGestures(canvas);
      
      // Store reference to the canvas
      fabricCanvasRef.current = canvas;
      
      // Register mouse/touch event handlers for drawing
      canvas.on('mouse:down', (e: any) => handleMouseDown(e.e));
      canvas.on('mouse:move', (e: any) => handleMouseMove(e.e));
      canvas.on('mouse:up', (e: any) => handleMouseUp(e.e));
      
      // Initialize grid after canvas is ready
      initializeGrid(canvas);
      
      // Notify parent that canvas is ready
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
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
  }, [width, height, isIOS, onCanvasReady, onError, handleMouseDown, handleMouseMove, handleMouseUp, lineColor, lineThickness]);
  
  // Update brush settings when tool, color or thickness changes
  useEffect(() => {
    if (!fabricCanvasRef.current || !fabricCanvasRef.current.freeDrawingBrush) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Set drawing mode based on tool
    canvas.isDrawingMode = tool === 'draw';
    
    // Update brush color and width
    canvas.freeDrawingBrush.color = lineColor || '#000000';
    canvas.freeDrawingBrush.width = lineThickness || 2;
    
    console.log(`Tool changed to ${tool}, drawing mode: ${canvas.isDrawingMode}`);
  }, [tool, lineColor, lineThickness]);
  
  return (
    <>
      <canvas 
        ref={canvasRef}
        data-testid="canvas-element"
        className={CANVAS_STYLES.WRAPPER_CLASS}
        style={{ border: CANVAS_STYLES.BORDER }}
      />
      
      {/* Distance tooltip for measurements */}
      <DistanceTooltip
        startPoint={drawingState.startPoint}
        currentPoint={drawingState.currentPoint}
        midPoint={drawingState.midPoint}
        isVisible={Boolean(drawingState.startPoint && drawingState.currentPoint && (tool === 'straightLine' || tool === 'wall'))}
        currentZoom={currentZoom}
        isSnappedToGrid={isSnappedToGrid}
        isAutoStraightened={isAutoStraightened}
      />
    </>
  );
};
