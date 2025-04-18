import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsIOS } from '@/hooks/use-ios';
import { MobileGridLayer } from './canvas/grid/MobileGridLayer';
import { forceGridVisibility } from '@/utils/grid/gridVisibilityManager';
import { toast } from 'sonner';
import { useGridMonitoring } from '@/hooks/useGridMonitoring';
import * as Sentry from '@sentry/react';
import { captureMessage, captureError } from '@/utils/sentry';
import logger from '@/utils/logger';

interface OptimizedCanvasProps {
  width: number;
  height: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  showGrid?: boolean;
}

export const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({
  width,
  height,
  onCanvasReady,
  onError,
  tool = DrawingMode.SELECT,
  lineColor = "#000000",
  lineThickness = 2,
  showGrid = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [initialized, setInitialized] = useState(false);
  const isMobile = useIsMobile();
  const isIOS = useIsIOS();
  const initTime = useRef(Date.now());
  
  // Use grid monitoring hook
  const { runGridDiagnostics } = useGridMonitoring(canvas, showGrid);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || initialized) return;
    
    try {
      initTime.current = Date.now();
      logger.info("Initializing canvas with dimensions:", width, "x", height);
      
      // Start Sentry transaction for canvas initialization
      const transaction = Sentry.startTransaction({
        name: 'canvas.initialization',
        op: 'init'
      });
      
      // Set context for better debugging
      Sentry.setContext("canvas", {
        dimensions: { width, height },
        isMobile,
        isIOS,
        userAgent: navigator.userAgent,
        tool,
        devicePixelRatio: window.devicePixelRatio || 1
      });
      
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        selection: tool === DrawingMode.SELECT,
        backgroundColor: "#ffffff"
      });
      
      // Set drawing settings
      fabricCanvas.freeDrawingBrush.color = lineColor;
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      
      // Add iOS-specific class if needed
      if (isIOS && fabricCanvas.wrapperEl) {
        fabricCanvas.wrapperEl.classList.add('ios-canvas');
        fabricCanvas.wrapperEl.classList.add('enhanced-grid-ios');
        
        captureMessage("iOS canvas initialized", "ios-canvas-init", {
          tags: {
            width: String(width),
            height: String(height)
          },
          extra: {
            cssClasses: fabricCanvas.wrapperEl.className
          }
        });
      }
      
      // Add mobile-specific class if needed
      if (isMobile && fabricCanvas.wrapperEl) {
        fabricCanvas.wrapperEl.classList.add('touch-optimized-canvas');
      }
      
      setCanvas(fabricCanvas);
      setInitialized(true);
      
      // Notify parent
      onCanvasReady(fabricCanvas);
      
      // Force a grid render after a short delay on iOS
      if (isIOS) {
        setTimeout(() => {
          forceGridVisibility(fabricCanvas);
          fabricCanvas.requestRenderAll();
          
          // Run diagnostics after initialization
          setTimeout(() => {
            runGridDiagnostics();
          }, 1000);
        }, 300);
      }
      
      // Complete transaction
      const initDuration = Date.now() - initTime.current;
      transaction.setData("initDuration", initDuration);
      transaction.setStatus("ok");
      transaction.finish();
      
      captureMessage("Canvas initialized successfully", "canvas-init-success", {
        tags: {
          isMobile: String(isMobile),
          isIOS: String(isIOS)
        },
        extra: {
          initDuration,
          dimensions: `${width}x${height}`,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error initializing canvas:", error);
      
      // Report error to Sentry
      captureError(error, "canvas-init-error", {
        level: 'error',
        tags: {
          isMobile: String(isMobile),
          isIOS: String(isIOS)
        },
        extra: {
          dimensions: `${width}x${height}`,
          timeElapsed: Date.now() - initTime.current,
          canvasState: canvasRef.current ? 'available' : 'missing'
        }
      });
      
      if (onError && error instanceof Error) {
        onError(error);
      }
      toast.error("Canvas initialization failed");
    }
  }, [canvasRef, width, height, tool, lineColor, lineThickness, onCanvasReady, onError, initialized, isMobile, isIOS, runGridDiagnostics, showGrid]);
  
  // Update canvas properties when tool, color, or thickness changes
  useEffect(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    canvas.renderAll();
  }, [canvas, tool, lineColor, lineThickness]);
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas 
        ref={canvasRef}
        className={`${isMobile ? 'touch-optimized-canvas' : ''} ${isIOS ? 'enhanced-grid-ios' : ''}`}
        data-testid="optimized-canvas"
      />
      
      {/* Use specialized mobile grid layer on mobile devices */}
      {isMobile && canvas && (
        <MobileGridLayer 
          canvas={canvas} 
          visible={showGrid}
          onGridCreated={(gridObjects) => {
            logger.info(`Created ${gridObjects.length} mobile grid objects`);
            captureMessage(`Mobile grid created with ${gridObjects.length} objects`, "mobile-grid-creation", {
              tags: {
                isIOS: String(isIOS),
                objectCount: String(gridObjects.length)
              }
            });
          }}
        />
      )}
    </div>
  );
};

export default OptimizedCanvas;
