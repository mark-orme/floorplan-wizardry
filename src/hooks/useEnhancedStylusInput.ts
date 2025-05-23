
import { useEffect, useRef, useState, useCallback } from 'react';
import { DEFAULT_STYLUS_PROFILE } from '@/types/core/StylusProfile';

// Add a custom PointerRawUpdateEvent interface to properly handle pointerrawupdate
interface PointerRawUpdateEvent extends Event {
  clientX?: number;
  clientY?: number;
  pressure?: number;
  pointerType?: string;
  tiltX?: number;
  tiltY?: number;
  twist?: number;
}

export const useEnhancedStylusInput = (canvasRef) => {
  const [pressure, setPressure] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [twist, setTwist] = useState(0);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const [isStylus, setIsStylus] = useState(false);
  const [stylusProfile, setStylusProfile] = useState(DEFAULT_STYLUS_PROFILE);
  
  const pointsRef = useRef<{ start?: { x: number, y: number }, end?: { x: number, y: number } }>({});
  
  const applyPressureCurve = useCallback((rawPressure) => {
    // Apply pressure curve from profile
    if (rawPressure === 0) return 0;
    if (rawPressure === 1) return 1;
    
    // Default linear response if curve is undefined
    const curve = stylusProfile.pressureCurve || [0, 0.25, 0.5, 0.75, 1];
    
    // Map pressure to curve
    const index = Math.min(
      Math.floor(rawPressure * (curve.length - 1)),
      curve.length - 2
    );
    const t = (rawPressure * (curve.length - 1)) - index;
    
    // Linear interpolation
    return curve[index] * (1 - t) + curve[index + 1] * t;
  }, [stylusProfile]);
  
  const applyTiltCurve = useCallback((tiltX, tiltY) => {
    // Calculate tilt magnitude (0-1 range)
    const tiltMagnitude = Math.min(
      1, 
      Math.sqrt(tiltX * tiltX + tiltY * tiltY) / 90
    );
    
    if (tiltMagnitude === 0) return 0;
    if (tiltMagnitude === 1) return 1;
    
    // Default linear tilt response if curve is undefined
    const curve = stylusProfile.tiltCurve || [0, 0.25, 0.5, 0.75, 1];
    
    // Map tilt to curve
    const index = Math.min(
      Math.floor(tiltMagnitude * (curve.length - 1)),
      curve.length - 2
    );
    const t = (tiltMagnitude * (curve.length - 1)) - index;
    
    // Linear interpolation
    return curve[index] * (1 - t) + curve[index + 1] * t;
  }, [stylusProfile]);
  
  // Calculate vector between two points
  const calculateVector = useCallback(() => {
    const { start, end } = pointsRef.current;
    
    if (!start || !end) return { dx: 0, dy: 0, length: 0 };
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    return { dx, dy, length };
  }, []);
  
  // Calculate direction angle in radians
  const calculateDirection = useCallback(() => {
    const { start, end } = pointsRef.current;
    
    if (!start || !end) return 0;
    
    return Math.atan2(end.y - start.y, end.x - start.x);
  }, []);
  
  // Listen for pointer events to extract stylus data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handlePointerDown = (e) => {
      // Reset points
      pointsRef.current = {
        start: { x: e.clientX, y: e.clientY },
        end: { x: e.clientX, y: e.clientY }
      };
      
      // Set initial values
      setPressure(e.pressure || 0);
      setTilt({
        x: e.tiltX || 0,
        y: e.tiltY || 0
      });
      setTwist(e.twist || 0);
      setLastPoint({
        x: e.clientX,
        y: e.clientY
      });
      
      // Check if this is a stylus
      setIsStylus(e.pointerType === 'pen');
    };
    
    const handlePointerMove = (e) => {
      // Update end point
      if (pointsRef.current.start) {
        pointsRef.current.end = {
          x: e.clientX,
          y: e.clientY
        };
      }
      
      // Update values
      setPressure(e.pressure || 0);
      setTilt({
        x: e.tiltX || 0,
        y: e.tiltY || 0
      });
      setTwist(e.twist || 0);
      setLastPoint({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    const handlePointerUp = () => {
      // Clear points
      pointsRef.current = {};
      
      // Reset values
      setPressure(0);
      setTilt({ x: 0, y: 0 });
      setTwist(0);
    };
    
    // Process raw pointer data (higher frequency)
    const handlePointerRawUpdate = (e: PointerRawUpdateEvent) => {
      // Only process stylus/pen
      if (e.pointerType !== 'pen') return;
      
      // Extract and process raw stylus data
      const rawPressure = e.pressure || 0;
      const adjustedPressure = applyPressureCurve(rawPressure) * (stylusProfile.pressureMultiplier || 1);
      
      setPressure(adjustedPressure);
      
      // Update tilt if available
      if (e.tiltX !== undefined && e.tiltY !== undefined) {
        setTilt({
          x: e.tiltX,
          y: e.tiltY
        });
      }
      
      // Update twist if available
      if (e.twist !== undefined) {
        setTwist(e.twist);
      }
      
      // Update position if available
      if (e.clientX !== undefined && e.clientY !== undefined) {
        setLastPoint({
          x: e.clientX,
          y: e.clientY
        });
      }
    };
    
    // Add event listeners
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    
    // Try to add raw event listener if supported
    try {
      // Cast with as any to bypass TypeScript's event type checking
      (canvas as any).addEventListener('pointerrawupdate', handlePointerRawUpdate);
    } catch (e) {
      console.log('PointerRawUpdate not supported');
    }
    
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      
      try {
        // Cast with as any to bypass TypeScript's event type checking
        (canvas as any).removeEventListener('pointerrawupdate', handlePointerRawUpdate);
      } catch (e) {
        console.log('PointerRawUpdate not supported');
      }
    };
  }, [canvasRef, applyPressureCurve, stylusProfile.pressureMultiplier]);
  
  // Apply stylus profile changes
  const updateStylusProfile = useCallback((profile) => {
    setStylusProfile(profile);
  }, []);
  
  // Get enhanced stylus data
  const getStylusData = useCallback(() => {
    const processedPressure = applyPressureCurve(pressure) * (stylusProfile.pressureMultiplier || 1);
    const processedTilt = applyTiltCurve(tilt.x, tilt.y) * (stylusProfile.tiltSensitivity || 0.5);
    
    return {
      pressure: processedPressure,
      tilt,
      tiltMagnitude: processedTilt,
      twist,
      direction: calculateDirection(),
      vector: calculateVector(),
      isStylus,
      position: lastPoint
    };
  }, [
    pressure,
    tilt,
    twist,
    isStylus,
    lastPoint,
    calculateDirection,
    calculateVector,
    applyPressureCurve,
    applyTiltCurve,
    stylusProfile.pressureMultiplier,
    stylusProfile.tiltSensitivity
  ]);
  
  return {
    stylusData: getStylusData(),
    isStylusActive: isStylus && pressure > 0,
    updateStylusProfile,
    stylusProfile
  };
};

export default useEnhancedStylusInput;
