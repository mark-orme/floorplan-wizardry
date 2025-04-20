
import { useEffect, useState, useCallback } from 'react';
import { isPressureSupported, isTiltSupported, getPressure, getTilt, isStylus } from '@/utils/canvas/pointerEvents';

interface StylusInputOptions {
  isEnabled: boolean;
  onPressureChange?: (pressure: number) => void;
  onTiltChange?: (tilt: { x: number, y: number }) => void;
}

export function useStylusInput({
  isEnabled,
  onPressureChange,
  onTiltChange
}: StylusInputOptions) {
  const [pressure, setPressure] = useState(0.5); // Default pressure
  const [tilt, setTilt] = useState({ x: 0, y: 0 }); // Default tilt
  const [isStylusActive, setIsStylusActive] = useState(false);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!isEnabled) return;
    
    // Check if the event is from a stylus
    if (isStylus(event)) {
      setIsStylusActive(true);
      
      // Handle pressure
      const newPressure = getPressure(event);
      setPressure(newPressure);
      if (onPressureChange) onPressureChange(newPressure);
      
      // Handle tilt if supported
      if (isTiltSupported()) {
        const newTilt = getTilt(event);
        setTilt(newTilt);
        if (onTiltChange) onTiltChange(newTilt);
      }
    }
  }, [isEnabled, onPressureChange, onTiltChange]);

  const handlePointerLeave = useCallback(() => {
    setIsStylusActive(false);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;
    
    // Only attach listeners if the device supports pressure or tilt
    if (isPressureSupported() || isTiltSupported()) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerleave', handlePointerLeave);
      
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
      };
    }
  }, [isEnabled, handlePointerMove, handlePointerLeave]);

  return {
    pressure,
    tilt,
    isStylus: isStylusActive,
    isPressureSupported: isPressureSupported(),
    isTiltSupported: isTiltSupported()
  };
}
