
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  extractStylusData, 
  normalizeStylusData, 
  StylusInputData,
  PalmRejectionController,
  PredictiveStrokeController
} from '@/utils/canvas/renderOptimizer';

interface UseEnhancedStylusInputProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  enabled: boolean;
  onStylusDataChange?: (data: StylusInputData) => void;
  usePointerRawUpdate?: boolean;
  usePalmRejection?: boolean;
  usePrediction?: boolean;
  predictionAmount?: number;
  onPredictedPointChange?: (point: { x: number; y: number } | null) => void;
}

export const useEnhancedStylusInput = ({
  canvasRef,
  enabled,
  onStylusDataChange,
  usePointerRawUpdate = true,
  usePalmRejection = true,
  usePrediction = true,
  predictionAmount = 0.03, // 30ms prediction
  onPredictedPointChange
}: UseEnhancedStylusInputProps) => {
  const [stylusData, setStylusData] = useState<StylusInputData>({
    pressure: 0.5,
    tiltX: 0,
    tiltY: 0
  });
  const [isPenActive, setIsPenActive] = useState(false);
  const palmRejectionRef = useRef<PalmRejectionController | null>(null);
  const predictiveStrokeRef = useRef<PredictiveStrokeController | null>(null);
  const pointerRawUpdateSupportedRef = useRef<boolean>(false);

  // Initialize the predictive stroke controller
  useEffect(() => {
    if (usePrediction) {
      predictiveStrokeRef.current = new PredictiveStrokeController();
      predictiveStrokeRef.current.setPredictionAmount(predictionAmount);
    }
    
    // Check if pointerrawupdate is supported
    if (usePointerRawUpdate) {
      try {
        // Check if pointerrawupdate event exists
        pointerRawUpdateSupportedRef.current = 'onpointerrawupdate' in window;
        
        if (pointerRawUpdateSupportedRef.current) {
          console.log('pointerrawupdate event is supported');
        } else {
          console.log('pointerrawupdate event is not supported');
        }
      } catch (error) {
        console.warn('Error checking pointerrawupdate support:', error);
        pointerRawUpdateSupportedRef.current = false;
      }
    }
    
    return () => {
      // Clean up prediction
      if (predictiveStrokeRef.current) {
        predictiveStrokeRef.current.reset();
      }
    };
  }, [usePrediction, predictionAmount, usePointerRawUpdate]);

  // Initialize the palm rejection controller
  useEffect(() => {
    if (!canvasRef.current || !usePalmRejection || !enabled) return;
    
    palmRejectionRef.current = new PalmRejectionController(canvasRef.current, {
      isPalmRejectionActive: true,
      onPenStart: (e) => {
        setIsPenActive(true);
      },
      onPenEnd: (e) => {
        setIsPenActive(false);
        
        // Reset prediction when pen is lifted
        if (predictiveStrokeRef.current) {
          predictiveStrokeRef.current.reset();
          onPredictedPointChange?.(null);
        }
      },
      onRejectedTouch: (e) => {
        console.debug('Palm touch rejected', e.pointerId);
      }
    });
    
    return () => {
      if (palmRejectionRef.current) {
        palmRejectionRef.current.dispose();
        palmRejectionRef.current = null;
      }
    };
  }, [canvasRef, usePalmRejection, enabled, onPredictedPointChange]);

  // Handle pointer events
  const handlePointerEvent = useCallback((event: PointerEvent) => {
    if (!enabled || event.pointerType !== 'pen') return;
    
    // Extract and normalize stylus data
    const data = extractStylusData(event);
    const normalized = normalizeStylusData(data);
    
    // Update state
    setStylusData(normalized);
    
    // Call callback
    if (onStylusDataChange) {
      onStylusDataChange(normalized);
    }
    
    // Update prediction if enabled
    if (usePrediction && predictiveStrokeRef.current) {
      const point = { x: event.clientX, y: event.clientY };
      const predictedPoint = predictiveStrokeRef.current.addPoint(point.x, point.y);
      
      if (onPredictedPointChange && predictedPoint) {
        onPredictedPointChange(predictedPoint);
      }
    }
  }, [enabled, onStylusDataChange, usePrediction, onPredictedPointChange]);

  // Attach event listeners
  useEffect(() => {
    if (!canvasRef.current || !enabled) return;
    
    const canvas = canvasRef.current;
    
    // Standard pointer events
    canvas.addEventListener('pointermove', handlePointerEvent, { passive: true });
    
    // Handle pointerrawupdate for lower latency if supported
    if (pointerRawUpdateSupportedRef.current) {
      canvas.addEventListener('pointerrawupdate', handlePointerEvent as EventListener, { passive: true });
    }
    
    return () => {
      canvas.removeEventListener('pointermove', handlePointerEvent);
      
      if (pointerRawUpdateSupportedRef.current) {
        canvas.removeEventListener('pointerrawupdate', handlePointerEvent as EventListener);
      }
    };
  }, [canvasRef, enabled, handlePointerEvent]);

  // Set up optimization for all pointer events
  useEffect(() => {
    if (!canvasRef.current || !enabled) return;
    
    const canvas = canvasRef.current;
    
    // Optimize canvas for stylus input
    canvas.style.touchAction = 'none';
    (canvas as any).style.webkitUserSelect = 'none';
    (canvas as any).style.webkitTouchCallout = 'none';
    
    // Use low latency mode if available (Chrome 85+)
    if ('setPointerCapture' in canvas && 'releasePointerCapture' in canvas) {
      const capturePointer = (e: PointerEvent) => {
        if (e.pointerType === 'pen') {
          try {
            canvas.setPointerCapture(e.pointerId);
          } catch (err) {
            console.warn('Error capturing pointer:', err);
          }
        }
      };
      
      const releasePointer = (e: PointerEvent) => {
        if (e.pointerType === 'pen') {
          try {
            canvas.releasePointerCapture(e.pointerId);
          } catch (err) {
            console.warn('Error releasing pointer:', err);
          }
        }
      };
      
      canvas.addEventListener('pointerdown', capturePointer);
      canvas.addEventListener('pointerup', releasePointer);
      canvas.addEventListener('pointercancel', releasePointer);
      
      return () => {
        canvas.removeEventListener('pointerdown', capturePointer);
        canvas.removeEventListener('pointerup', releasePointer);
        canvas.removeEventListener('pointercancel', releasePointer);
      };
    }
  }, [canvasRef, enabled]);

  return {
    stylusData,
    isPenActive,
    isPalmRejectionActive: palmRejectionRef.current?.isPalmRejectionEnabled() ?? false,
    isPointerRawUpdateSupported: pointerRawUpdateSupportedRef.current,
    togglePalmRejection: useCallback(() => {
      if (palmRejectionRef.current) {
        const newState = !palmRejectionRef.current.isPalmRejectionEnabled();
        palmRejectionRef.current.setPalmRejectionActive(newState);
        return newState;
      }
      return false;
    }, []),
    setPredictionAmount: useCallback((amount: number) => {
      if (predictiveStrokeRef.current) {
        predictiveStrokeRef.current.setPredictionAmount(amount);
      }
    }, [])
  };
};
