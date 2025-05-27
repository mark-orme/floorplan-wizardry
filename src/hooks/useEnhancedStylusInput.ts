import { useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseEnhancedStylusInputProps {
  canvasRef: React.MutableRefObject<FabricCanvas | null>;
  isEnabled?: boolean;
}

export const useEnhancedStylusInput = ({
  canvasRef,
  isEnabled = false
}: UseEnhancedStylusInputProps) => {
  const pressureRef = useRef<number>(1);
  
  const normalizePressure = useCallback((rawPressure: number): number => {
    return Math.max(0.1, Math.min(1, rawPressure));
  }, []);
  
  const calculateTiltEffect = useCallback((tiltX: number, tiltY: number): number => {
    const tiltMagnitude = Math.sqrt(tiltX * tiltX + tiltY * tiltY);
    return Math.max(0.5, 1 - tiltMagnitude / 90);
  }, []);
  
  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (!isEnabled || !canvasRef.current) return;
    
    pressureRef.current = normalizePressure(e.pressure || 1);
  }, [isEnabled, canvasRef, normalizePressure]);
  
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!isEnabled || !canvasRef.current) return;
    
    pressureRef.current = normalizePressure(e.pressure || 1);
  }, [isEnabled, canvasRef, normalizePressure]);
  
  const updateStylusProfile = useCallback((profile: any) => {
    // Update stylus profile settings
  }, []);
  
  return {
    pressureRef,
    handlePointerDown,
    handlePointerMove,
    updateStylusProfile
  };
};
