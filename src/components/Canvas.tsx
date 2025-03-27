
/**
 * Canvas Component
 * Primary canvas component for fabric.js rendering
 * @module Canvas
 */
import React, { useEffect, useRef } from 'react';
import { useCanvasInit } from '@/hooks/useCanvasInit';
import { Canvas as FabricCanvas, PencilBrush } from 'fabric';
import { toast } from 'sonner';
import { useReliableGridInitialization } from '@/hooks/useReliableGridInitialization';
import { initializeCanvasGestures } from '@/utils/fabric/gestures';
import { CanvasCreationOptions } from '@/types/fabric';
import { CANVAS_STYLES, CANVAS_SCALING } from '@/constants/canvas';

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
  
  // Detect iOS devices to apply platform-specific optimizations
  // iOS requires special handling for touch events and performance
  const isIOS = 
    typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  
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
        canvas.freeDrawingBrush.color = '#000000';
        canvas.freeDrawingBrush.width = 2;
      }
      
      // Enable rendering now that initialization is complete
      canvas.renderOnAddRemove = true;
      
      // Initialize multi-touch gestures support
      initializeCanvasGestures(canvas);
      
      // Store reference to the canvas
      fabricCanvasRef.current = canvas;
      
      // Notify parent that canvas is ready
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      // Cleanup function to dispose canvas on unmount
      return () => {
        try {
          canvas.dispose();
          fabricCanvasRef.current = null;
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
  }, [width, height, isIOS, onCanvasReady, onError]);
  
  return (
    <canvas 
      ref={canvasRef}
      data-testid="canvas-element"
      className={CANVAS_STYLES.WRAPPER_CLASS}
      style={{ border: CANVAS_STYLES.BORDER }}
    />
  );
};
