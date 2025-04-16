
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas';
import { useRestorePrompt } from '@/hooks/useRestorePrompt';
import { DebugInfoState } from '@/types/core/DebugInfo';
import { captureError, captureMessage } from '@/utils/sentryUtils';
import { 
  logCanvasInitAttempt, 
  logCanvasInitSuccess, 
  handleCanvasInitError,
  generateCanvasDiagnosticReport,
  checkFabricJsLoading
} from '@/utils/canvas/canvasErrorMonitoring';
import {
  safeCanvasInitialization,
  resetInitializationState,
  validateCanvasInitialization,
  handleInitializationFailure
} from '@/utils/canvas/safeCanvasInitialization';

export interface CanvasProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  showGridDebug?: boolean;
  setDebugInfo?: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  tool?: string;
  lineThickness?: number;
  lineColor?: string;
  wallColor?: string;
  wallThickness?: number;
  style?: React.CSSProperties;
  forceGridVisible?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  onCanvasReady,
  onError,
  showGridDebug = false,
  setDebugInfo,
  style,
  tool,
  lineThickness,
  lineColor,
  wallColor,
  wallThickness,
  forceGridVisible
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasId = useRef<string>(`canvas-${Math.random().toString(36).substring(2, 9)}`).current;
  const canvasInitTimeRef = useRef<number>(Date.now());
  const initTriesRef = useRef<number>(0);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const documentReadyRef = useRef<boolean>(document.readyState === 'complete');
  
  // Reset initialization state when component mounts
  useEffect(() => {
    resetInitializationState();
    return () => {
      // Clean up on unmount
      resetInitializationState();
    };
  }, []);
  
  // Ensure document is fully loaded before canvas initialization
  useEffect(() => {
    if (document.readyState !== 'complete') {
      const handleReadyStateChange = () => {
        if (document.readyState === 'complete') {
          documentReadyRef.current = true;
          document.removeEventListener('readystatechange', handleReadyStateChange);
        }
      };
      
      document.addEventListener('readystatechange', handleReadyStateChange);
      return () => {
        document.removeEventListener('readystatechange', handleReadyStateChange);
      };
    }
  }, []);
  
  // Verify Fabric.js is available on initialization
  useEffect(() => {
    if (!documentReadyRef.current) return;
    
    const fabricStatus = checkFabricJsLoading();
    
    // Report loading status to debugging tools
    console.log("Fabric.js loading status:", fabricStatus);
    
    if (!fabricStatus.fabricDetected || fabricStatus.fabricProblem) {
      captureError(
        new Error(`Fabric.js setup issue: ${fabricStatus.fabricProblem || 'Not detected'}`), 
        'fabric-canvas-mount-error', 
        {
          level: 'error',
          tags: {
            component: 'Canvas',
            operation: 'mount'
          },
          extra: {
            fabricStatus,
            canvasId,
            canvasElement: !!canvasRef.current,
            dimensions: { width, height },
            props: { 
              width, 
              height, 
              showGridDebug, 
              tool, 
              lineThickness 
            }
          }
        }
      );
    }
  }, [canvasId, width, height, showGridDebug, tool, lineThickness]);
  
  // Initialize canvas with enhanced error monitoring and safety checks
  useEffect(() => {
    // Skip initialization if document isn't ready
    if (document.readyState !== 'complete') {
      const timer = setTimeout(() => {
        // Trigger a re-render to try again
        initTriesRef.current += 1;
      }, 500);
      return () => clearTimeout(timer);
    }
    
    if (!canvasRef.current) {
      captureMessage('Canvas element ref not available during initialization', 'canvas-ref-missing', {
        level: 'warning',
        tags: {
          component: 'Canvas',
          operation: 'initialization'
        },
        extra: {
          diagnostics: generateCanvasDiagnosticReport(),
          canvasId,
          dimensions: { width, height }
        }
      });
      return;
    }
    
    try {
      // Track initialization attempt with enhanced diagnostics
      const attempt = logCanvasInitAttempt(canvasId, { width, height });
      initTriesRef.current = attempt;
      
      // Additional logging for specific issue with lower.el
      console.log("🔍 Pre-initialization canvas check:", {
        canvasId,
        canvasElement: canvasRef.current,
        fabricInstance: typeof FabricCanvas === 'function' ? 'available' : 'unavailable',
        width: canvasRef.current.width,
        height: canvasRef.current.height
      });
      
      // Make sure we set the canvas ID to help with debugging
      canvasRef.current.id = canvasId;
      
      // Force canvas dimensions to ensure proper initialization
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      
      // Ensure the canvas element is properly sized and visible in DOM
      const canvasElement = canvasRef.current;
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;
      canvasElement.style.display = 'block';
      
      // If canvas parent has zero dimensions, apply minimum size
      if (canvasElement.parentElement) {
        const parentStyle = window.getComputedStyle(canvasElement.parentElement);
        if (parentStyle.width === '0px' || parentStyle.height === '0px') {
          canvasElement.parentElement.style.minWidth = `${width}px`;
          canvasElement.parentElement.style.minHeight = `${height}px`;
        }
      }
      
      // Use our safe initialization function instead of direct constructor
      // This addresses the 'elements.lower.el' error specifically
      const canvas = safeCanvasInitialization(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        renderOnAddRemove: true,
        fireRightClick: true,
        stopContextMenu: false // Allow context menu for debugging
      });
      
      // Validate the canvas was properly initialized
      if (!canvas || !validateCanvasInitialization(canvas)) {
        throw new Error('Canvas failed validation after initialization');
      }
      
      // Store reference for cleanup
      fabricCanvasRef.current = canvas;
      
      // Dispatch success event to track successful initialization
      const successEvent = new CustomEvent('canvas-init-success', {
        detail: { canvasId, timestamp: Date.now() }
      });
      window.dispatchEvent(successEvent);
      
      // Log successful initialization
      const initDuration = Date.now() - canvasInitTimeRef.current;
      logCanvasInitSuccess(canvasId, initDuration, {
        canvasType: canvas.constructor.name,
        objectCount: canvas.getObjects().length,
        dimensions: { width, height },
        lowerCanvasInitialized: !!canvas.lowerCanvasEl,
        upperCanvasInitialized: !!canvas.upperCanvasEl
      });
      
      // Notify parent component
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      // Update global canvas state for debugging
      if (typeof window !== 'undefined') {
        (window as any).__canvas_state = {
          width: canvas.width,
          height: canvas.height,
          zoom: canvas.getZoom(),
          objectCount: canvas.getObjects().length,
          gridVisible: canvas.getObjects().some((obj: any) => obj.isGrid),
          lastOperation: 'initialize',
          initialized: true,
          lowerCanvasExists: !!canvas.lowerCanvasEl,
          upperCanvasExists: !!canvas.upperCanvasEl
        };
      }
      
      // Set up cleanup function
      return () => {
        try {
          if (canvas) {
            // Clean up all event listeners first
            canvas.dispose();
            fabricCanvasRef.current = null;
            
            captureMessage('Canvas disposed successfully', 'canvas-dispose', {
              level: 'info',
              tags: {
                component: 'Canvas',
                operation: 'cleanup'
              }
            });
          }
        } catch (disposeError) {
          captureError(disposeError, 'canvas-dispose-error', {
            level: 'error',
            tags: {
              component: 'Canvas',
              operation: 'cleanup'
            }
          });
        }
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      
      // Get additional context about the error
      let specificErrorType = 'generic-error';
      if (error instanceof Error) {
        if (error.message.includes('elements.lower.el')) {
          specificErrorType = 'lower-element-undefined';
        } else if (error.message.includes('already initialized')) {
          specificErrorType = 'already-initialized';
        }
      }
      
      // Use enhanced error handling with diagnostics
      const isFatalError = handleCanvasInitError(
        error, 
        canvasId, 
        canvasRef.current,
        initTriesRef.current
      );
      
      // Call our specific handler for initialization failures 
      // to provide enhanced diagnostics
      handleInitializationFailure(error instanceof Error ? error.message : String(error));
      
      // Dispatch custom event for global error handling with enhanced context
      const errorEvent = new CustomEvent('canvas-init-error', { 
        detail: { 
          error, 
          canvasId, 
          isFatal: isFatalError, 
          specific: specificErrorType,
          timestamp: Date.now(),
          fabricStatus: checkFabricJsLoading()
        } 
      });
      window.dispatchEvent(errorEvent);
      
      // Notify parent component if callback provided
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [width, height, onCanvasReady, onError, canvasId]);
  
  return (
    <div 
      className="canvas-wrapper relative" 
      data-testid="canvas-element"
      ref={canvasWrapperRef}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-200 dark:border-gray-700 shadow-sm"
        data-canvas-id={canvasId}
        data-show-grid-debug={showGridDebug ? 'true' : 'false'}
        style={{
          display: 'block', // Force display block to prevent layout issues
          ...style
        }}
      />
      
      {/* Debug overlay */}
      {showGridDebug && (
        <div className="absolute top-0 right-0 bg-red-100 text-red-800 p-1 text-xs rounded m-1 opacity-75">
          Debug Mode
        </div>
      )}
    </div>
  );
};
