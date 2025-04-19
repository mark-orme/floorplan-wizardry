
/**
 * Hook for WebGL-accelerated canvas with Fabric.js
 * Provides high-performance canvas rendering with fallback
 * @module hooks/useWebGLCanvas
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';
import { vibrateFeedback } from '@/utils/canvas/pointerEvents';

// Settings for WebGL rendering
export interface WebGLSettings {
  enabled: boolean;
  contextAttributes?: WebGLContextAttributes;
  handleResize?: boolean;
  preserveDrawingBuffer?: boolean;
}

// Default WebGL context attributes
const DEFAULT_WEBGL_ATTRIBUTES: WebGLContextAttributes = {
  alpha: true,
  antialias: true,
  depth: false,
  failIfMajorPerformanceCaveat: false,
  premultipliedAlpha: true,
  preserveDrawingBuffer: true,
  stencil: false
};

/**
 * Hook for using WebGL-accelerated canvas
 * Automatically falls back to standard canvas if WebGL is not supported
 */
export function useWebGLCanvas({
  canvasRef,
  containerRef,
  settings = { enabled: true }
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef?: React.RefObject<HTMLDivElement>;
  settings?: WebGLSettings;
}) {
  const [isWebGLEnabled, setIsWebGLEnabled] = useState(false);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const contextLostRef = useRef(false);
  
  // Function to check WebGL support
  const checkWebGLSupport = useCallback((): boolean => {
    if (typeof window === 'undefined' || !window.WebGLRenderingContext) {
      return false;
    }
    
    const canvas = document.createElement('canvas');
    let gl: WebGLRenderingContext | null = null;
    
    try {
      // Try to get WebGL context
      gl = canvas.getContext('webgl') as WebGLRenderingContext || 
           canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    } catch (e) {
      return false;
    }
    
    // If we got a context, WebGL is supported
    const hasWebGL = !!gl;
    
    // Clean up
    if (gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    
    return hasWebGL;
  }, []);
  
  // Initialize WebGL canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current || !settings.enabled) {
      return;
    }
    
    // Check for WebGL support
    const supportsWebGL = checkWebGLSupport();
    setIsWebGLSupported(supportsWebGL);
    
    if (!supportsWebGL) {
      logger.warn('WebGL not supported. Using standard canvas rendering.');
    }
    
    try {
      // Set up WebGL with appropriate context
      if (supportsWebGL) {
        // Create Fabric canvas with WebGL
        fabricCanvasRef.current = new FabricCanvas(canvasRef.current, {
          enableRetinaScaling: true,
          renderOnAddRemove: false,
          isWebGLSupported: true,
          webglContextAttributes: {
            ...DEFAULT_WEBGL_ATTRIBUTES,
            ...settings.contextAttributes,
            preserveDrawingBuffer: settings.preserveDrawingBuffer ?? true
          }
        });
        
        setIsWebGLEnabled(true);
        logger.info('WebGL canvas initialized successfully');
        
        // Provide haptic feedback if supported
        vibrateFeedback(15);
      } else {
        // Create standard canvas as fallback
        fabricCanvasRef.current = new FabricCanvas(canvasRef.current, {
          enableRetinaScaling: true,
          renderOnAddRemove: false
        });
        
        logger.info('Standard canvas initialized as WebGL fallback');
      }
      
      // Set up WebGL context loss handler
      canvasRef.current.addEventListener('webglcontextlost', handleContextLost, false);
      canvasRef.current.addEventListener('webglcontextrestored', handleContextRestored, false);
    } catch (error) {
      logger.error('Failed to initialize WebGL canvas', { error });
      
      // Try to create standard canvas as fallback
      try {
        fabricCanvasRef.current = new FabricCanvas(canvasRef.current, {
          enableRetinaScaling: true,
          renderOnAddRemove: false
        });
        
        setIsWebGLEnabled(false);
        logger.info('Fallback to standard canvas after WebGL initialization failed');
      } catch (fallbackError) {
        logger.error('Failed to initialize fallback canvas', { error: fallbackError });
      }
    }
    
    // Handle resize if needed
    if (settings.handleResize && containerRef?.current) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
    
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('webglcontextlost', handleContextLost);
        canvasRef.current.removeEventListener('webglcontextrestored', handleContextRestored);
      }
      
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [canvasRef, containerRef, settings.enabled, checkWebGLSupport]);
  
  // Handle WebGL context loss
  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault();
    contextLostRef.current = true;
    logger.warn('WebGL context lost');
    
    // Notify user of context loss
    if (typeof window !== 'undefined') {
      const notification = document.createElement('div');
      notification.textContent = 'Drawing performance reduced - GPU context lost';
      notification.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#f8d7da;color:#721c24;padding:10px;text-align:center;z-index:9999;';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 5000);
    }
  }, []);
  
  // Handle WebGL context restoration
  const handleContextRestored = useCallback((event: Event) => {
    contextLostRef.current = false;
    logger.info('WebGL context restored');
    
    // Redraw canvas
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.renderAll();
    }
    
    // Notify user of context restoration
    vibrateFeedback([10, 50, 10]);
  }, []);
  
  // Handle container resize
  const handleResize = useCallback(() => {
    if (!fabricCanvasRef.current || !containerRef?.current) return;
    
    const { clientWidth, clientHeight } = containerRef.current;
    
    if (clientWidth > 0 && clientHeight > 0) {
      fabricCanvasRef.current.setDimensions({
        width: clientWidth,
        height: clientHeight
      });
    }
  }, [containerRef]);
  
  // Function to force canvas redraw
  const redraw = useCallback(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.renderAll();
    }
  }, []);
  
  return {
    fabricCanvas: fabricCanvasRef.current,
    isWebGLEnabled,
    isWebGLSupported,
    isContextLost: contextLostRef.current,
    redraw
  };
}
