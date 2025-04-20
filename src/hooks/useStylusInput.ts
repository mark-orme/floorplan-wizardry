import { useEffect, useState } from 'react';
import { getPressure, isTiltSupported, getTilt } from '@/utils/canvas/pointerEvents';

interface UseStylusInputProps {
  isEnabled: boolean;
  onPressureChange: (pressure: number) => void;
  onTiltChange?: (tiltX: number, tiltY: number) => void;
}

export const useStylusInput = ({ isEnabled, onPressureChange, onTiltChange }: UseStylusInputProps) => {
  const [isStylus, setIsStylus] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'stylus' || event.pointerType === 'pen') {
        setIsStylus(true);
        const pressure = getPressure(event);
        onPressureChange(pressure);

        if (isTiltSupported() && onTiltChange) {
          const { tiltX, tiltY } = getTilt(event);
          onTiltChange(tiltX, tiltY);
        }
      } else {
        setIsStylus(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'stylus' || event.pointerType === 'pen') {
        setIsStylus(true);
      } else {
        setIsStylus(false);
      }
    };

    const handlePointerUp = () => {
      setIsStylus(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isEnabled, onPressureChange, onTiltChange]);

  return { isStylus };
};
