import { useCallback, useRef, useState, useEffect } from 'react';
import { Point } from '@/types/core/Point';

interface StylusInputOptions {
  onPressureChange?: (pressure: number) => void;
  onTiltChange?: (tiltX: number, tiltY: number) => void;
  pressureCurve?: 'linear' | 'quadratic' | 'cubic' | 'custom';
  customPressureCurve?: (pressure: number) => number;
  minPressure?: number;
  maxPressure?: number;
  debug?: boolean;
}

interface StylusState {
  isStylus: boolean;
  pressure: number;
  tiltX: number;
  tiltY: number;
  azimuthAngle: number | null;
  altitudeAngle: number | null;
  twist: number | null;
}

export const useEnhancedStylusInput = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options: StylusInputOptions = {}
) => {
  const {
    onPressureChange,
    onTiltChange,
    pressureCurve = 'linear',
    customPressureCurve,
    minPressure = 0.1,
    maxPressure = 1.0,
    debug = false
  } = options;

  const [stylusState, setStylusState] = useState<StylusState>({
    isStylus: false,
    pressure: 1.0,
    tiltX: 0,
    tiltY: 0,
    azimuthAngle: null,
    altitudeAngle: null,
    twist: null
  });

  const pressureRef = useRef(1.0);
  const isStylusRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const stylusProfileRef = useRef<string | null>(null);

  // Process raw pressure value through the selected curve
  const processPressure = useCallback((rawPressure: number): number => {
    // Ensure pressure is within bounds
    let pressure = Math.max(minPressure, Math.min(maxPressure, rawPressure));
    
    // Apply pressure curve
    switch (pressureCurve) {
      case 'quadratic':
        pressure = pressure * pressure;
        break;
      case 'cubic':
        pressure = pressure * pressure * pressure;
        break;
      case 'custom':
        if (customPressureCurve) {
          pressure = customPressureCurve(pressure);
        }
        break;
      case 'linear':
      default:
        // Linear is default, no transformation needed
        break;
    }
    
    return pressure;
  }, [pressureCurve, customPressureCurve, minPressure, maxPressure]);

  // Process tilt values
  const processTilt = useCallback((tiltX: number, tiltY: number) => {
    // Normalize tilt values to -1 to 1 range
    const normalizedTiltX = Math.max(-1, Math.min(1, tiltX / 90));
    const normalizedTiltY = Math.max(-1, Math.min(1, tiltY / 90));
    
    if (onTiltChange) {
      onTiltChange(normalizedTiltX, normalizedTiltY);
    }
    
    return { tiltX: normalizedTiltX, tiltY: normalizedTiltY };
  }, [onTiltChange]);

  // Handle pointer events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerDown = (e: PointerEvent) => {
      const isStylus = e.pointerType === 'pen';
      isStylusRef.current = isStylus;
      
      if (isStylus) {
        const pressure = processPressure(e.pressure);
        pressureRef.current = pressure;
        
        const { tiltX, tiltY } = processTilt(e.tiltX, e.tiltY);
        
        setStylusState({
          isStylus: true,
          pressure,
          tiltX,
          tiltY,
          azimuthAngle: (e as any).azimuthAngle || null,
          altitudeAngle: (e as any).altitudeAngle || null,
          twist: (e as any).twist || null
        });
        
        if (onPressureChange) {
          onPressureChange(pressure);
        }
        
        lastPointRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isStylusRef.current) {
        const pressure = processPressure(e.pressure);
        pressureRef.current = pressure;
        
        const { tiltX, tiltY } = processTilt(e.tiltX, e.tiltY);
        
        setStylusState(prev => ({
          ...prev,
          pressure,
          tiltX,
          tiltY,
          azimuthAngle: (e as any).azimuthAngle || prev.azimuthAngle,
          altitudeAngle: (e as any).altitudeAngle || prev.altitudeAngle,
          twist: (e as any).twist || prev.twist
        }));
        
        if (onPressureChange) {
          onPressureChange(pressure);
        }
        
        lastPointRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isStylusRef.current) {
        isStylusRef.current = false;
        pressureRef.current = 1.0;
        
        setStylusState(prev => ({
          ...prev,
          isStylus: false,
          pressure: 1.0
        }));
        
        if (onPressureChange) {
          onPressureChange(1.0);
        }
        
        lastPointRef.current = null;
      }
    };

    // Check for stylus support
    const detectStylusSupport = () => {
      if (window.navigator.maxTouchPoints > 0) {
        if ('ontouchstart' in window) {
          return 'touch-enabled';
        }
      }
      
      if (window.PointerEvent) {
        return 'pointer-events-supported';
      }
      
      return 'no-stylus-support';
    };

    // Detect stylus profile
    const detectStylusProfile = () => {
      const profile = detectStylusSupport();
      stylusProfileRef.current = profile;
      
      if (debug) {
        console.log('Stylus profile detected:', profile);
      }
    };

    // Initialize
    detectStylusProfile();

    // Add event listeners
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    // Cleanup
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [canvasRef, processPressure, processTilt, onPressureChange, debug]);

  // Return the current state and helper methods
  return {
    ...stylusState,
    currentPressure: pressureRef.current,
    isActive: isStylusRef.current,
    lastPoint: lastPointRef.current,
    stylusProfile: stylusProfileRef.current,
    
    // Helper methods
    resetPressure: () => {
      pressureRef.current = 1.0;
      setStylusState(prev => ({ ...prev, pressure: 1.0 }));
      if (onPressureChange) onPressureChange(1.0);
    },
    
    setPressure: (pressure: number) => {
      const processedPressure = processPressure(pressure);
      pressureRef.current = processedPressure;
      setStylusState(prev => ({ ...prev, pressure: processedPressure }));
      if (onPressureChange) onPressureChange(processedPressure);
    }
  };
};

export default useEnhancedStylusInput;
