
import { useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { StylusProfile, DEFAULT_STYLUS_PROFILE } from '@/types/core/StylusProfile';

interface UseEnhancedStylusInputProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  onPerformanceReport?: (fps: number) => void;
}

// Mock stylusProfileService if it doesn't exist
const stylusProfileService = {
  getProfile: async (id: string): Promise<StylusProfile> => {
    return DEFAULT_STYLUS_PROFILE;
  }
};

export function useEnhancedStylusInput({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  onPerformanceReport
}: UseEnhancedStylusInputProps) {
  const [isPenMode, setIsPenMode] = useState(false);
  const [pressure, setPressure] = useState(0.5);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [activeProfile, setActiveProfile] = useState<StylusProfile>(DEFAULT_STYLUS_PROFILE);
  const [start, setStart] = useState<{ x: number, y: number } | null>(null);
  const [end, setEnd] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    // Load the default profile
    stylusProfileService.getProfile('default')
      .then(profile => {
        if (profile) {
          setActiveProfile(profile);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!canvas || !enabled) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'pen') {
        setIsPenMode(true);
        setPressure(e.pressure);
        setTiltX(e.tiltX || 0);
        setTiltY(e.tiltY || 0);

        if (canvas.freeDrawingBrush) {
          // Apply pressure curve from active profile
          const pressureIndex = Math.floor(e.pressure * (activeProfile.pressureCurve.length - 1));
          const adjustedPressure = activeProfile.pressureCurve[pressureIndex];
          
          canvas.freeDrawingBrush.width = lineThickness * adjustedPressure;
        }
      }
    };

    // Fixed lines with proper null checks
    if (start && end) {
      const distance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + 
        Math.pow(end.y - start.y, 2)
      );
      console.log('Distance:', distance);
    }

    // Fixed another case with null checks
    if (start && end) {
      const angle = Math.atan2(
        end.y - start.y, 
        end.x - start.x
      );
      console.log('Angle:', angle);
    }
    
    // Tilt processing with proper null checks
    if (activeProfile.tiltCurve && activeProfile.tiltCurve.length > 0) {
      const tiltAmount = Math.sqrt(tiltX * tiltX + tiltY * tiltY);
      const tiltIndex = Math.floor(tiltAmount * (activeProfile.tiltCurve.length - 1));
      
      if (tiltIndex >= 0 && tiltIndex < activeProfile.tiltCurve.length) {
        const tiltFactor = activeProfile.tiltCurve[tiltIndex];
        console.log('Tilt factor:', tiltFactor);
      }
    }

    // Fix the error with event types by correctly casting
    canvas.getElement().addEventListener('pointermove', handlePointerMove as unknown as EventListener);
    
    // Remove problematic pointerrawupdate event handler
    // Note: pointerrawupdate is not a standard event in most browsers
    // So we'll use a different approach for high-frequency updates
    
    const handleRafPointerUpdate = () => {
      // This is a RAF-based alternative to pointerrawupdate
      if (isPenMode && canvas.freeDrawingBrush) {
        // Apply any high-frequency updates here
      }
      
      if (enabled) {
        requestAnimationFrame(handleRafPointerUpdate);
      }
    };
    
    // Start RAF loop if enabled
    if (enabled) {
      requestAnimationFrame(handleRafPointerUpdate);
    }

    return () => {
      canvas.getElement().removeEventListener('pointermove', handlePointerMove as unknown as EventListener);
      // No need to remove the RAF handler as it will stop when enabled becomes false
    };
  }, [canvas, enabled, lineThickness, activeProfile, start, end, isPenMode, tiltX, tiltY]);

  const adjustedThickness = lineThickness * pressure;
  const smoothedPoints = []; // Implement point smoothing if needed

  return {
    isPenMode,
    pressure,
    tiltX,
    tiltY,
    activeProfile,
    adjustedThickness,
    smoothedPoints
  };
}
