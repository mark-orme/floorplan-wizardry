
import { useState, useEffect, useCallback } from 'react';
import { isPressureSupported, isTiltSupported, isStylus, getPressure, getTilt } from '@/utils/canvas/pointerEvents';

interface StylusInputOptions {
  isEnabled?: boolean;
  onPressureChange?: (pressure: number) => void;
  onTiltChange?: (tiltX: number, tiltY: number, angle: number) => void;
  onStylusDetected?: (isStylus: boolean) => void;
}

export function useStylusInput({
  isEnabled = true,
  onPressureChange,
  onTiltChange,
  onStylusDetected
}: StylusInputOptions = {}) {
  const [pressure, setPressure] = useState(0.5);
  const [tilt, setTilt] = useState({ tiltX: 0, tiltY: 0, angle: 0 });
  const [isActive, setIsActive] = useState(false);
  const [hasStylusSupport, setHasStylusSupport] = useState(false);

  // Check for stylus support
  useEffect(() => {
    const pressureSupport = isPressureSupported();
    const tiltSupport = isTiltSupported();
    
    setHasStylusSupport(pressureSupport || tiltSupport);
  }, []);
  
  // Handler for pointer move events
  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!isEnabled) return;
    
    const isStylusEvent = isStylus(event);
    
    if (isStylusEvent || isActive) {
      // Always set isActive to true when we detect a stylus
      if (isStylusEvent && !isActive) {
        setIsActive(true);
        onStylusDetected?.(true);
      }
      
      // Get pressure
      const newPressure = getPressure(event);
      setPressure(newPressure);
      onPressureChange?.(newPressure);
      
      // Get tilt
      const newTilt = getTilt(event);
      setTilt(newTilt);
      onTiltChange?.(newTilt.tiltX, newTilt.tiltY, newTilt.tiltAngle);
    }
  }, [isEnabled, isActive, onPressureChange, onTiltChange, onStylusDetected]);
  
  // Handler for pointer down events
  const handlePointerDown = useCallback((event: PointerEvent) => {
    if (!isEnabled) return;
    
    if (isStylus(event)) {
      setIsActive(true);
      onStylusDetected?.(true);
    }
  }, [isEnabled, onStylusDetected]);
  
  // Handler for pointer up events
  const handlePointerUp = useCallback(() => {
    if (!isEnabled) return;
    
    // Reset pressure to default
    setPressure(0.5);
    onPressureChange?.(0.5);
  }, [isEnabled, onPressureChange]);
  
  // Set up event listeners
  useEffect(() => {
    if (!isEnabled) return;
    
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isEnabled, handlePointerMove, handlePointerDown, handlePointerUp]);
  
  return {
    isStylus: isActive,
    pressure,
    tilt,
    hasStylusSupport
  };
}
