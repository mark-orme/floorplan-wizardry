
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

    canvas.getElement().addEventListener('pointermove', handlePointerMove);

    return () => {
      canvas.getElement().removeEventListener('pointermove', handlePointerMove);
    };
  }, [canvas, enabled, lineThickness, activeProfile]);

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
