/**
 * Hook for enhanced Apple Pencil and touch support in drawing tools
 * @module hooks/straightLineTool/useApplePencilSupport
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useDrawingErrorReporting } from '@/hooks/useDrawingErrorReporting';
import { Point } from '@/types/core/Point';

export interface UseApplePencilSupportProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineThickness: number;
}

export interface ApplePencilState {
  isApplePencil: boolean;
  pressure: number;
  tilt: { x: number; y: number } | null;
  isPencilMode: boolean;
  lastPosition: Point | null;
}

/**
 * Hook for enhanced Apple Pencil support in drawing tools
 * Provides improved pressure sensitivity, tilt detection, and palm rejection
 */
export const useApplePencilSupport = ({
  fabricCanvasRef,
  lineThickness = 2
}: UseApplePencilSupportProps) => {
  const { reportDrawingError, logDrawingEvent } = useDrawingErrorReporting();
  
  // Track Apple Pencil state
  const [pencilState, setPencilState] = useState<ApplePencilState>({
    isApplePencil: false,
    pressure: 1,
    tilt: null,
    isPencilMode: false,
    lastPosition: null
  });
  
  // Cache for touch events to help with palm rejection
  const touchTimeoutRef = useRef<number | null>(null);
  const lastTouchRef = useRef<Touch | null>(null);
  
  // Detect if platform likely supports Apple Pencil
  const isIOSPlatform = useCallback(() => {
    if (typeof navigator === 'undefined') return false;
    
    return (
      /iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }, []);
  
  /**
   * Process touch event to extract Apple Pencil specific data
   */
  const processPencilTouchEvent = useCallback((e: TouchEvent): { 
    isApplePencil: boolean;
    pressure: number;
    tilt: { x: number; y: number } | null;
    position: Point | null;
  } => {
    try {
      if (!e.touches || e.touches.length === 0) {
        return { isApplePencil: false, pressure: 1, tilt: null, position: null };
      }
      
      const touch = e.touches[0];
      // Apple Pencil specific values
      const force = 'force' in touch ? touch.force : 1;
      
      // Apple Pencil detection heuristics
      const isStylus = 
        (touch as any).touchType === 'stylus' || 
        (touch as any).radiusX < 5 || // Small radius typical of stylus
        force > 0;
      
      // Try to extract tilt if available (not standard, may be in experimental APIs)
      let tilt = null;
      if (isStylus && (touch as any).altitudeAngle) {
        // Convert altitude and azimuth to x/y tilt representation
        const altitude = (touch as any).altitudeAngle || 0;
        const azimuth = (touch as any).azimuthAngle || 0;
        tilt = {
          x: Math.cos(azimuth) * Math.sin(altitude),
          y: Math.sin(azimuth) * Math.sin(altitude)
        };
      }
      
      // Get position
      const position = {
        x: touch.clientX,
        y: touch.clientY
      };
      
      // If it's a pencil, update last touch
      if (isStylus) {
        lastTouchRef.current = touch;
      }
      
      return {
        isApplePencil: isStylus,
        pressure: isStylus ? Math.max(force, 0.1) : 1, // Ensure minimum pressure
        tilt,
        position
      };
    } catch (error) {
      reportDrawingError(error, 'process-pencil-data', {
        tool: 'line',
        interaction: { type: 'touch' }
      });
      return { isApplePencil: false, pressure: 1, tilt: null, position: null };
    }
  }, [reportDrawingError]);
  
  /**
   * Calculate adjusted line thickness based on pressure
   */
  const getPressureAdjustedThickness = useCallback((pressure: number): number => {
    // Non-linear pressure curve for more natural feel
    const pressureCurve = Math.pow(pressure, 1.5);
    return Math.max(lineThickness * pressureCurve, lineThickness * 0.5);
  }, [lineThickness]);

  /**
   * Set up Apple Pencil event handlers
   */
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const canvasElement = canvas.getElement();
    
    // Palm rejection - ignore touches that aren't from the pencil when in pencil mode
    const handleTouchStart = (e: TouchEvent) => {
      const pencilData = processPencilTouchEvent(e);
      
      // Update state with detected pencil data
      setPencilState(prev => ({
        ...prev,
        isApplePencil: pencilData.isApplePencil,
        pressure: pencilData.pressure,
        tilt: pencilData.tilt,
        isPencilMode: pencilData.isApplePencil || prev.isPencilMode,
        lastPosition: pencilData.position
      }));
      
      // If we're in pencil mode and this isn't a pencil touch, possibly reject it
      if (pencilState.isPencilMode && !pencilData.isApplePencil) {
        // Only prevent non-pencil touches if we recently had pencil interaction
        if (Date.now() - (touchTimeoutRef.current || 0) < 1000) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      
      // If this is a pencil, update the timeout
      if (pencilData.isApplePencil) {
        touchTimeoutRef.current = Date.now();
        logDrawingEvent('Apple Pencil detected', 'stylus-detection', {
          interaction: {
            type: 'stylus',
            pressure: pencilData.pressure,
            tilt: pencilData.tilt
          }
        });
      }
    };
    
    // Handle touch move for pressure updates
    const handleTouchMove = (e: TouchEvent) => {
      if (!pencilState.isPencilMode) return;
      
      const pencilData = processPencilTouchEvent(e);
      if (pencilData.isApplePencil) {
        setPencilState(prev => ({
          ...prev,
          pressure: pencilData.pressure,
          tilt: pencilData.tilt,
          lastPosition: pencilData.position
        }));
        
        // Update the timeout to keep pencil mode active
        touchTimeoutRef.current = Date.now();
      }
    };
    
    // Handle touch end to reset pencil mode after delay
    const handleTouchEnd = (e: TouchEvent) => {
      if (!pencilState.isPencilMode) return;
      
      // Schedule exit from pencil mode after a delay if no new pencil touches
      setTimeout(() => {
        if (Date.now() - (touchTimeoutRef.current || 0) > 1000) {
          setPencilState(prev => ({
            ...prev,
            isPencilMode: false
          }));
        }
      }, 1500);
    };
    
    // Add event listeners
    canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvasElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // iOS specific setup for preventing unwanted gestures
    if (isIOSPlatform()) {
      // Prevent pinch zoom on iOS
      document.addEventListener('gesturestart', e => e.preventDefault());
      document.addEventListener('gesturechange', e => e.preventDefault());
      
      // Add meta viewport to disable scaling
      let metaViewport = document.querySelector('meta[name="viewport"]');
      if (!metaViewport) {
        metaViewport = document.createElement('meta');
        metaViewport.setAttribute('name', 'viewport');
        document.head.appendChild(metaViewport);
      }
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Clean up event listeners
    return () => {
      canvasElement.removeEventListener('touchstart', handleTouchStart);
      canvasElement.removeEventListener('touchmove', handleTouchMove);
      canvasElement.removeEventListener('touchend', handleTouchEnd);
      
      if (isIOSPlatform()) {
        document.removeEventListener('gesturestart', e => e.preventDefault());
        document.removeEventListener('gesturechange', e => e.preventDefault());
      }
    };
  }, [fabricCanvasRef, pencilState.isPencilMode, processPencilTouchEvent, logDrawingEvent, isIOSPlatform]);
  
  return {
    pencilState,
    isApplePencil: pencilState.isApplePencil,
    currentPressure: pencilState.pressure,
    adjustedLineThickness: getPressureAdjustedThickness(pencilState.pressure),
    isPencilMode: pencilState.isPencilMode,
    processPencilTouchEvent
  };
};
