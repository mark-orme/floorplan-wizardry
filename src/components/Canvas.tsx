
/**
 * Canvas Component
 * Primary canvas component for fabric.js rendering
 * @module Canvas
 */
import React, { useEffect, useRef } from 'react';
import { useCanvasInit } from '@/hooks/useCanvasInit';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { useReliableGridInitialization } from '@/hooks/useReliableGridInitialization';
import { initializeCanvasGestures } from '@/utils/fabric/gestures';
import { CanvasCreationOptions } from '@/types/fabric';

/**
 * Default canvas styling constants
 */
const CANVAS_STYLES = {
  /**
   * Default background color
   */
  BACKGROUND_COLOR: '#FFFFFF',
  
  /**
   * Default border style
   */
  BORDER: '1px solid #eee',
  
  /**
   * Default canvas wrapper class
   */
  WRAPPER_CLASS: 'canvas-container touch-none'
};

/**
 * Canvas scaling constants
 */
const CANVAS_SCALING = {
  /**
   * Minimum zoom level
   */
  MIN_ZOOM: 0.1,
  
  /**
   * Maximum zoom level
   */
  MAX_ZOOM: 10,
  
  /**
   * Touch target tolerance for iOS (in pixels)
   */
  IOS_TOUCH_TOLERANCE: 15
};

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
 * @param {CanvasProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const Canvas: React.FC<CanvasProps> = ({ 
  onError, 
  width = 800,
  height = 600,
  onCanvasReady 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  // Detect iOS
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
      const canvasOptions: CanvasCreationOptions = {
        width,
        height,
        backgroundColor: CANVAS_STYLES.BACKGROUND_COLOR,
        enableRetinaScaling: !isIOS, // Disable for iOS to improve performance
        stopContextMenu: true,
        fireRightClick: false,
        renderOnAddRemove: false,
      };
      
      // Add iOS-specific options
      if (isIOS) {
        Object.assign(canvasOptions, {
          enablePointerEvents: true,
          skipTargetFind: false,
          perPixelTargetFind: false,
          targetFindTolerance: CANVAS_SCALING.IOS_TOUCH_TOLERANCE,
          interactive: true
        });
      }
      
      // Create the Fabric.js canvas instance
      const canvas = new FabricCanvas(canvasRef.current, canvasOptions);
      
      // Initialize touch gestures for the canvas
      initializeCanvasGestures(canvas);
      
      // Apply iOS-specific canvas optimizations
      if (isIOS) {
        // Disable unnecessary event listeners to improve performance
        canvas.selection = false;
        
        // Set wrapper element touch action to none
        if (canvas.wrapperEl) {
          canvas.wrapperEl.style.touchAction = 'none';
        }
        console.log("Canvas: Applying iOS-specific optimizations");
      }
      
      // Store the canvas reference
      fabricCanvasRef.current = canvas;
      
      // Store it in a global registry for debugging/recovery
      if (!window.fabricCanvasInstances) {
        window.fabricCanvasInstances = [];
      }
      window.fabricCanvasInstances.push(canvas);
      
      // Also store a reference on the canvas element itself for debugging
      (canvasRef.current as any)._fabric = canvas;
      
      console.log("Canvas: Fabric.js canvas created successfully");
      
      // Call the onCanvasReady callback if provided
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
    } catch (error) {
      console.error("Canvas: Error creating Fabric.js canvas", error);
      
      // Show error toast
      toast.error("Error initializing canvas");
      
      // Call onError callback if provided
      if (onError) {
        onError();
      }
      
      // Dispatch canvas-init-error event
      window.dispatchEvent(new CustomEvent('canvas-init-error', { 
        detail: error instanceof Error ? error : new Error('Canvas initialization failed') 
      }));
    }
    
    // Cleanup function
    return () => {
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
          console.log("Canvas: Fabric.js canvas disposed");
        } catch (error) {
          console.error("Canvas: Error disposing canvas", error);
        }
        
        fabricCanvasRef.current = null;
      }
    };
  }, [width, height, onCanvasReady, onError, isIOS]);
  
  // Use our hook for any additional initialization logic
  useCanvasInit({ onError });
  
  // Use our new reliable grid initialization
  const { isGridInitialized } = useReliableGridInitialization(fabricCanvasRef);
  
  // Log grid initialization status
  useEffect(() => {
    if (isGridInitialized) {
      console.log("Canvas: Grid initialized successfully");
    }
  }, [isGridInitialized]);
  
  return (
    <div className={CANVAS_STYLES.WRAPPER_CLASS} style={{ touchAction: 'none' }}>
      <canvas 
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full border border-gray-200 touch-none"
        style={{ 
          border: CANVAS_STYLES.BORDER,
          touchAction: 'none' // Critical for iOS
        }}
        data-testid="fabric-canvas"
        data-grid-initialized={isGridInitialized ? "true" : "false"}
        data-ios-optimized={isIOS ? "true" : "false"}
      />
    </div>
  );
};

// Fix global declarations to resolve typing conflicts
declare global {
  interface HTMLCanvasElement {
    _fabric?: unknown; // Use unknown instead of any for type safety
  }
  
  interface Window {
    fabricCanvasInstances?: FabricCanvas[]; // Use imported FabricCanvas type
  }
}
