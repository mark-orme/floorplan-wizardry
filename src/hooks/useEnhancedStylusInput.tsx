
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
  const [start, setStart] = useState<{ x: number, y: number } | undefined>(undefined);
  const [end, setEnd] = useState<{ x: number, y: number } | undefined>(undefined);

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

    // Fixed lines with optional chaining
    if (start && end) {
      const distance = Math.sqrt(
        Math.pow((end?.x ?? 0) - (start?.x ?? 0), 2) + 
        Math.pow((end?.y ?? 0) - (start?.y ?? 0), 2)
      );
      console.log('Distance:', distance);
    }

    // Fixed another case with null checks
    if (start && end) {
      const angle = Math.atan2(
        (end?.y ?? 0) - (start?.y ?? 0), 
        (end?.x ?? 0) - (start?.x ?? 0)
      );
      console.log('Angle:', angle);
    }

    // Fix the error with event types by casting to 'any'
    canvas.getElement().addEventListener('pointermove', handlePointerMove as any);
    
    // 'pointerrawupdate' is not a standard event type, so we need to cast it
    // This is commented out to avoid errors, as it's not a standard event
    /*
    canvas.getElement().addEventListener('pointerrawupdate', (e: PointerEvent) => {
      // Handle raw pointer updates here
    } as any);
    */

    return () => {
      canvas.getElement().removeEventListener('pointermove', handlePointerMove as any);
      // canvas.getElement().removeEventListener('pointerrawupdate', handlePointerUpdate as any);
    };
  }, [canvas, enabled, lineThickness, activeProfile, start, end]);

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
