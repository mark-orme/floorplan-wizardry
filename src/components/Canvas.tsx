
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas';
import { useRestorePrompt } from '@/hooks/useRestorePrompt';
import { DebugInfoState } from '@/types/core/DebugInfo';
import { captureError, captureMessage } from '@/utils/sentryUtils';

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
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) {
      captureMessage('Canvas element ref not available during initialization', 'canvas-ref-missing', {
        level: 'warning',
        tags: {
          component: 'Canvas',
          operation: 'initialization'
        }
      });
      return;
    }
    
    try {
      // Track initialization attempt
      initTriesRef.current += 1;
      const initAttempt = initTriesRef.current;
      
      captureMessage(`Canvas initialization attempt #${initAttempt}`, 'canvas-init-attempt', {
        level: 'info',
        tags: {
          component: 'Canvas',
          operation: 'initialization',
          attempt: String(initAttempt)
        },
        extra: {
          dimensions: { width, height },
          canvasElementId: canvasId,
          timestamp: new Date().toISOString()
        }
      });
      
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true
      });
      
      const initDuration = Date.now() - canvasInitTimeRef.current;
      
      captureMessage(`Canvas initialized successfully in ${initDuration}ms`, 'canvas-init-success', {
        level: 'info',
        tags: {
          component: 'Canvas',
          operation: 'initialization'
        },
        extra: {
          dimensions: { width, height },
          duration: initDuration,
          canvasType: canvas.constructor.name
        }
      });
      
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
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
      captureError(error, 'canvas-initialization-error', {
        level: 'error',
        tags: {
          component: 'Canvas',
          operation: 'initialization',
          attempt: String(initTriesRef.current)
        },
        extra: {
          dimensions: { width, height },
          domInfo: canvasRef.current ? {
            width: canvasRef.current.width,
            height: canvasRef.current.height,
            offsetWidth: canvasRef.current.offsetWidth,
            offsetHeight: canvasRef.current.offsetHeight,
            clientWidth: canvasRef.current.clientWidth,
            clientHeight: canvasRef.current.clientHeight
          } : 'Canvas element not available',
          browserInfo: {
            userAgent: navigator.userAgent,
            vendor: navigator.vendor,
            platform: navigator.platform,
            devicePixelRatio: window.devicePixelRatio
          }
        }
      });
      
      if (onError && error instanceof Error) {
        onError(error);
      }
      
      // Check for fatal errors that would prevent further attempts
      const isFatalCanvasError = error instanceof Error && (
        error.message.includes('has been already initialized') ||
        error.message.includes('context creation failed') ||
        error.message.includes('WebGL context') ||
        error.message.includes('elements.lower.el')
      );
      
      if (isFatalCanvasError) {
        captureMessage('Fatal canvas initialization error detected', 'canvas-fatal-error', {
          level: 'fatal',
          tags: {
            component: 'Canvas',
            operation: 'initialization',
            errorType: 'fatal'
          }
        });
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
