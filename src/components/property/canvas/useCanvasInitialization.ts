/**
 * Hook for handling canvas initialization
 * Manages canvas initialization state and error handling
 * @module components/property/canvas/useCanvasInitialization
 */
import { useState, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import { captureError } from "@/utils/sentryUtils";
import logger from "@/utils/logger";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { resetGridProgress } from "@/utils/gridManager";

/**
 * Hook for handling canvas initialization
 * 
 * @param {Function} onCanvasError - Callback for canvas error
 * @returns Initialization state and handlers
 */
export const useCanvasInitialization = (onCanvasError?: () => void) => {
  const [isReady, setIsReady] = useState(false);
  const [initAttempt, setInitAttempt] = useState(0);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const unmountedRef = useRef(false);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  /**
   * Handle successful canvas initialization
   */
  const handleCanvasReady = (canvas: FabricCanvas) => {
    logger.info('Canvas ready callback received');
    console.log('Canvas ready callback received', {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      objectCount: canvas.getObjects().length
    });
    
    setFabricCanvas(canvas);
    fabricCanvasRef.current = canvas;
    toast.success("Canvas initialized successfully");
    
    // Log detailed canvas info to help debug grid issues
    captureError(
      new Error("Canvas initialization info"), 
      {
        level: "info",
        tags: {
          component: "FloorPlanCanvas",
          operation: "canvas-ready"
        },
        extra: {
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          objectCount: canvas.getObjects().length,
          initAttempt
        }
      }
    );
  };
  
  /**
   * Handle canvas initialization error
   */
  const handleCanvasInitError = (error: Error) => {
    logger.error('Canvas initialization error', error);
    console.error('Canvas initialization error', error);
    
    setCanvasError(error.message);
    toast.error(`Canvas error: ${error.message}`);
    
    // Report detailed error to Sentry
    captureError(error, {
      level: "error",
      tags: {
        component: "FloorPlanCanvas",
        operation: "canvas-init",
        attempt: String(initAttempt)
      },
      extra: {
        initAttempt,
        browserInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform
        }
      }
    });
    
    if (onCanvasError) {
      onCanvasError();
    }
  };
  
  /**
   * Handle canvas initialization retry
   */
  const handleCanvasRetry = () => {
    try {
      // Reset canvas initialization state
      resetInitializationState();
      resetGridProgress();
      
      // Reset state to trigger re-rendering
      setIsReady(false);
      setFabricCanvas(null);
      fabricCanvasRef.current = null;
      setCanvasError(null);
      setInitAttempt(prev => prev + 1);
      
      logger.info("Retrying canvas initialization...");
      console.log('Retrying canvas initialization, attempt:', initAttempt + 1);
      
      toast.info("Retrying canvas initialization...");
      
      // Try to re-initialize after a delay
      setTimeout(() => {
        if (!unmountedRef.current) {
          setIsReady(true);
        }
      }, 150);
    } catch (error) {
      console.error('Error during canvas retry:', error);
    }
  };
  
  return {
    isReady,
    setIsReady,
    initAttempt,
    fabricCanvas,
    canvasError,
    unmountedRef,
    fabricCanvasRef,
    gridLayerRef,
    handleCanvasReady,
    handleCanvasInitError,
    handleCanvasRetry
  };
};
