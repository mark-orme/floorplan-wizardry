
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
  generateCanvasDiagnosticReport
} from '@/utils/canvas/canvasErrorMonitoring';

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
  
  // Initialize canvas with enhanced error monitoring
  useEffect(() => {
    if (!canvasRef.current) {
      captureMessage('Canvas element ref not available during initialization', 'canvas-ref-missing', {
        level: 'warning',
        tags: {
          component: 'Canvas',
          operation: 'initialization'
        },
        extra: {
          diagnostics: generateCanvasDiagnosticReport()
        }
      });
      return;
    }
    
    try {
      // Track initialization attempt with enhanced diagnostics
      const attempt = logCanvasInitAttempt(canvasId, { width, height });
      initTriesRef.current = attempt;
      
      // Create the Fabric.js canvas instance
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true
      });
      
      // Log successful initialization
      const initDuration = Date.now() - canvasInitTimeRef.current;
      logCanvasInitSuccess(canvasId, initDuration, {
        canvasType: canvas.constructor.name,
        objectCount: canvas.getObjects().length,
        dimensions: { width, height }
      });
      
      // Notify parent component
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      // Update global canvas state for debugging
      if (typeof window !== 'undefined') {
        window.__canvas_state = {
          width: canvas.width,
          height: canvas.height,
          zoom: canvas.getZoom(),
          objectCount: canvas.getObjects().length,
          gridVisible: canvas.getObjects().some((obj: any) => obj.isGrid),
          lastOperation: 'initialize'
        };
      }
      
      // Set up cleanup function
      return () => {
        try {
          canvas.dispose();
          captureMessage('Canvas disposed successfully', 'canvas-dispose', {
            level: 'info',
            tags: {
              component: 'Canvas',
              operation: 'cleanup'
            }
          });
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
      
      // Use enhanced error handling with diagnostics
      const isFatalError = handleCanvasInitError(
        error, 
        canvasId, 
        canvasRef.current,
        initTriesRef.current
      );
      
      // Dispatch custom event for global error handling
      const errorEvent = new CustomEvent('canvas-init-error', { 
        detail: { error, canvasId, isFatal: isFatalError } 
      });
      window.dispatchEvent(errorEvent);
      
      // Notify parent component if callback provided
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [width, height, onCanvasReady, onError, canvasId]);
  
  return (
    <div className="canvas-wrapper relative" data-testid="canvas-element">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-200 dark:border-gray-700 shadow-sm"
        data-canvas-id={canvasId}
        data-show-grid-debug={showGridDebug ? 'true' : 'false'}
        style={style}
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
