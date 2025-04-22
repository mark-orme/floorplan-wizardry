
import { useEffect, useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { StylusProfile, DEFAULT_STYLUS_PROFILE } from '@/types/core/StylusProfile';
import { getActiveProfile } from '@/utils/stylus/stylusProfileService';
import { Point } from '@/types/core/Geometry';
import { smoothPoints } from '@/utils/drawing/smoothPoints';

interface UseEnhancedStylusInputOptions {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  onPerformanceReport?: (fps: number) => void;
}

interface StylusState {
  isPenMode: boolean;
  pressure: number;
  tiltX: number;
  tiltY: number;
  azimuthAngle: number;
  isDown: boolean;
  lastPoint: Point | null;
  predictedPoints: Point[];
}

export const useEnhancedStylusInput = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  onPerformanceReport
}: UseEnhancedStylusInputOptions) => {
  const [stylusState, setStylusState] = useState<StylusState>({
    isPenMode: false,
    pressure: 0.5,
    tiltX: 0,
    tiltY: 0,
    azimuthAngle: 0,
    isDown: false,
    lastPoint: null,
    predictedPoints: []
  });
  
  const [activeProfile, setActiveProfile] = useState<StylusProfile>(DEFAULT_STYLUS_PROFILE);
  const pointerIdRef = useRef<number | null>(null);
  const velocityRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const lastTimestampRef = useRef<number>(0);
  const pointHistoryRef = useRef<Point[]>([]);
  
  // Load active profile
  useEffect(() => {
    if (!enabled) return;
    
    getActiveProfile().then(profile => {
      setActiveProfile(profile);
    });
  }, [enabled]);
  
  // Apply the pressure curve from the profile
  const applyPressureCurve = useCallback((rawPressure: number): number => {
    if (!activeProfile.pressureCurve || activeProfile.pressureCurve.length < 2) {
      return rawPressure;
    }
    
    const { pressureCurve } = activeProfile;
    
    // Simple linear interpolation between curve points
    const segmentCount = pressureCurve.length - 1;
    const index = Math.min(Math.floor(rawPressure * segmentCount), segmentCount - 1);
    const remainder = (rawPressure * segmentCount) - index;
    
    const start = pressureCurve[index];
    const end = pressureCurve[index + 1];
    
    return start + remainder * (end - start);
  }, [activeProfile]);
  
  // Apply the tilt curve from the profile
  const applyTiltCurve = useCallback((tiltX: number, tiltY: number): number => {
    if (!activeProfile.tiltCurve) {
      return 0; // No tilt effect if no curve is defined
    }
    
    // Calculate tilt magnitude (0-1 range)
    const tiltMagnitude = Math.min(1, Math.sqrt(tiltX * tiltX + tiltY * tiltY) / 90);
    
    const { tiltCurve } = activeProfile;
    
    // Simple linear interpolation
    const segmentCount = tiltCurve.length - 1;
    const index = Math.min(Math.floor(tiltMagnitude * segmentCount), segmentCount - 1);
    const remainder = (tiltMagnitude * segmentCount) - index;
    
    const start = tiltCurve[index];
    const end = tiltCurve[index + 1];
    
    return start + remainder * (end - start);
  }, [activeProfile]);
  
  // Calculate predicted points based on velocity
  const calculatePrediction = useCallback((currentPoint: Point, velocity: { x: number, y: number }, count = 3): Point[] => {
    const predicted: Point[] = [];
    
    // Don't predict if velocity is too low
    if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) {
      return predicted;
    }
    
    // Add prediction points at increasing distances
    for (let i = 1; i <= count; i++) {
      predicted.push({
        x: currentPoint.x + (velocity.x * i * 0.05), // Scale factor to control prediction length
        y: currentPoint.y + (velocity.y * i * 0.05)
      });
    }
    
    return predicted;
  }, []);
  
  // Handle pointer events with full tilt support
  const handlePointerEvent = useCallback((e: PointerEvent) => {
    if (!enabled || !canvas) return;
    
    // Detect if this is a pen
    const isPen = e.pointerType === 'pen';
    
    // For palm rejection: if we have an active pen pointer, ignore touch events
    if (pointerIdRef.current !== null && pointerIdRef.current !== e.pointerId && !isPen) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // Extract stylus data
    const pressure = isPen ? (e.pressure || 0.5) : 0.5;
    const tiltX = isPen ? (e.tiltX || 0) : 0;
    const tiltY = isPen ? (e.tiltY || 0) : 0;
    
    // Calculate azimuth angle (if available)
    let azimuthAngle = 0;
    if ('azimuthAngle' in e) {
      azimuthAngle = (e as any).azimuthAngle || 0;
    } else if (tiltX !== 0 || tiltY !== 0) {
      // Approximate azimuth from tilt
      azimuthAngle = Math.atan2(tiltY, tiltX);
    }
    
    // Update pressure with the calibrated curve
    const adjustedPressure = applyPressureCurve(pressure);
    
    // Apply tilt effect if enabled
    const tiltEffect = applyTiltCurve(tiltX, tiltY);
    
    // Calculate current point from event
    const rect = canvas.getElement().getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    // Update velocity calculation
    const now = performance.now();
    if (lastTimestampRef.current > 0 && stylusState.lastPoint) {
      const timeDelta = now - lastTimestampRef.current;
      if (timeDelta > 0) {
        velocityRef.current = {
          x: (point.x - stylusState.lastPoint.x) / timeDelta * 16.67, // Normalize to 60fps
          y: (point.y - stylusState.lastPoint.y) / timeDelta * 16.67
        };
      }
    }
    lastTimestampRef.current = now;
    
    // Add to point history for smoothing
    pointHistoryRef.current.push(point);
    if (pointHistoryRef.current.length > 10) {
      pointHistoryRef.current.shift();
    }
    
    // Calculate predicted points based on velocity
    const predictedPoints = calculatePrediction(point, velocityRef.current);
    
    // Update stylus state
    setStylusState(prev => ({
      ...prev,
      isPenMode: isPen,
      pressure: adjustedPressure,
      tiltX,
      tiltY,
      azimuthAngle,
      lastPoint: point,
      predictedPoints
    }));
    
    // Update brush if in drawing mode
    if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
      // Combine pressure and tilt for final stroke width
      const finalWidth = lineThickness * (0.5 + adjustedPressure + tiltEffect);
      canvas.freeDrawingBrush.width = finalWidth;
      
      // Could also adjust opacity, color, etc. based on pressure and tilt
    }
  }, [activeProfile, applyPressureCurve, applyTiltCurve, calculatePrediction, canvas, enabled, lineThickness, stylusState.lastPoint]);
  
  // Set up optimized event handlers
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    const canvasElement = canvas.getElement();
    
    // Use these events for maximum performance
    const eventOptions = { passive: false };
    
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        pointerIdRef.current = e.pointerId;
        
        // Reset point history on new stroke
        pointHistoryRef.current = [];
        velocityRef.current = { x: 0, y: 0 };
        
        // Update state
        setStylusState(prev => ({
          ...prev,
          isDown: true
        }));
        
        // Process the normal event data
        handlePointerEvent(e);
        
        // Try to set pointer capture
        try {
          canvasElement.setPointerCapture(e.pointerId);
        } catch (err) {
          console.warn('Could not set pointer capture:', err);
        }
      }
    };
    
    const handlePointerMove = (e: PointerEvent) => {
      // Process pointer move
      handlePointerEvent(e);
      
      // Handle coalesced events if available for smoother lines
      if (e.getCoalescedEvents && pointerIdRef.current === e.pointerId) {
        const events = e.getCoalescedEvents();
        
        // Process all coalesced events
        for (const event of events) {
          handlePointerEvent(event);
        }
      }
    };
    
    const handlePointerUp = (e: PointerEvent) => {
      if (pointerIdRef.current === e.pointerId) {
        // Final event processing
        handlePointerEvent(e);
        
        // Reset state
        pointerIdRef.current = null;
        setStylusState(prev => ({
          ...prev,
          isDown: false,
          predictedPoints: []
        }));
        
        // Release pointer capture
        try {
          canvasElement.releasePointerCapture(e.pointerId);
        } catch (err) {
          // Ignore release errors
        }
      }
    };
    
    // Add event listeners - use raw pointer events for best performance
    canvasElement.addEventListener('pointerdown', handlePointerDown, eventOptions);
    canvasElement.addEventListener('pointermove', handlePointerMove, eventOptions);
    canvasElement.addEventListener('pointerup', handlePointerUp);
    canvasElement.addEventListener('pointercancel', handlePointerUp);
    canvasElement.addEventListener('pointerleave', handlePointerUp);
    
    // Use pointer raw update if available (Chrome only) for ultra-low-latency
    if ('onpointerrawupdate' in window) {
      canvasElement.addEventListener('pointerrawupdate', handlePointerMove, eventOptions);
    }
    
    return () => {
      // Remove event listeners
      canvasElement.removeEventListener('pointerdown', handlePointerDown);
      canvasElement.removeEventListener('pointermove', handlePointerMove);
      canvasElement.removeEventListener('pointerup', handlePointerUp);
      canvasElement.removeEventListener('pointercancel', handlePointerUp);
      canvasElement.removeEventListener('pointerleave', handlePointerUp);
      
      if ('onpointerrawupdate' in window) {
        canvasElement.removeEventListener('pointerrawupdate', handlePointerMove);
      }
    };
  }, [canvas, enabled, handlePointerEvent]);
  
  // Return all the stylus state for use in the UI
  return {
    ...stylusState,
    activeProfile,
    adjustedThickness: lineThickness * (0.5 + stylusState.pressure),
    smoothedPoints: smoothPoints(pointHistoryRef.current, 3),
    velocityVector: velocityRef.current
  };
};
