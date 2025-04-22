
import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { 
  isPenEvent, 
  getCoalescedEvents, 
  configurePalmRejection,
  optimizeCanvasForDrawing,
  FrameTimer,
  setupWebGLRendering
} from '@/utils/canvas/pointerOptimizations';

interface UseOptimizedStylusDrawingProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  onPerformanceReport?: (fps: number) => void;
}

export const useOptimizedStylusDrawing = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  onPerformanceReport
}: UseOptimizedStylusDrawingProps) => {
  const [isPenMode, setIsPenMode] = useState(false);
  const [pressure, setPressure] = useState(0.5);
  const cleanupFunctionsRef = useRef<Array<() => void>>([]);
  const frameTimerRef = useRef<FrameTimer | null>(null);
  const webGLCleanupRef = useRef<(() => void) | null>(null);
  
  // Set up performance monitoring
  useEffect(() => {
    if (!enabled) return;
    
    frameTimerRef.current = new FrameTimer();
    frameTimerRef.current.startMonitoring((fps, avgTime) => {
      if (onPerformanceReport) {
        onPerformanceReport(fps);
      }
      
      console.log(`Drawing performance: ${fps.toFixed(1)} FPS (${avgTime.toFixed(2)}ms/frame)`);
    });
    
    return () => {
      if (frameTimerRef.current) {
        frameTimerRef.current.stopMonitoring();
      }
    };
  }, [enabled, onPerformanceReport]);
  
  // Set up advanced drawing optimizations
  const setupAdvancedDrawing = useCallback(() => {
    if (!canvas || !enabled) return;
    
    const canvasElement = canvas.getElement();
    
    // Step 1: Apply canvas optimizations
    optimizeCanvasForDrawing(canvasElement);
    
    // Step 2: Configure palm rejection
    const palmRejectionCleanup = configurePalmRejection(canvasElement);
    
    // Step 3: Configure pen detection
    const penDetectionHandler = (e: PointerEvent) => {
      const isPen = e.pointerType === 'pen';
      setIsPenMode(isPen);
      
      if (isPen) {
        // Apply pressure sensitivity
        const pressureValue = e.pressure || 0.5;
        setPressure(pressureValue);
        
        if (canvas.freeDrawingBrush) {
          // Scale line thickness based on pressure
          canvas.freeDrawingBrush.width = lineThickness * (0.5 + pressureValue);
        }
      }
    };
    
    // Step 4: Handle coalesced events for smoother lines
    const pointerMoveHandler = (e: PointerEvent) => {
      if (e.pointerType === 'pen' && canvas.isDrawingMode) {
        const events = getCoalescedEvents(e);
        
        if (events.length > 1) {
          console.log(`Processing ${events.length} coalesced events`);
          // The canvas will handle the actual drawing
        }
      }
    };
    
    // Add event listeners
    canvasElement.addEventListener('pointerdown', penDetectionHandler);
    canvasElement.addEventListener('pointermove', pointerMoveHandler, { passive: true });
    
    // Step 5: Set up WebGL rendering if needed
    webGLCleanupRef.current = setupWebGLRendering(canvasElement);
    
    // Set up cleanup
    cleanupFunctionsRef.current.push(
      palmRejectionCleanup,
      () => canvasElement.removeEventListener('pointerdown', penDetectionHandler),
      () => canvasElement.removeEventListener('pointermove', pointerMoveHandler),
      () => webGLCleanupRef.current && webGLCleanupRef.current()
    );
    
    // Optimize the fabric.js canvas
    if (canvas.freeDrawingBrush) {
      // Set better decimate value for smoother curves
      canvas.freeDrawingBrush.decimate = 2; // Adjust if needed
    }
    
    // Disable reactive rendering during active drawing for better performance
    const originalRequestRenderAll = canvas.requestRenderAll.bind(canvas);
    canvas.requestRenderAll = function() {
      if (!this.isDrawingMode || !isPenMode) {
        originalRequestRenderAll();
      }
    };
    
    cleanupFunctionsRef.current.push(() => {
      canvas.requestRenderAll = originalRequestRenderAll;
    });
    
  }, [canvas, enabled, lineThickness]);
  
  // Run setup when component mounts
  useEffect(() => {
    setupAdvancedDrawing();
    
    return () => {
      // Clean up all optimizations
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
      cleanupFunctionsRef.current = [];
    };
  }, [setupAdvancedDrawing]);
  
  return {
    isPenMode,
    pressure,
    // Add more useful state/methods as needed
  };
};
