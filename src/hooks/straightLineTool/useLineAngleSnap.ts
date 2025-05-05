
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';

interface UseLineAngleSnapProps {
  enabled?: boolean;
  angleStep?: number;
}

export const useLineAngleSnap = ({
  enabled = true,
  angleStep = 45
}: UseLineAngleSnapProps = {}) => {
  const [anglesEnabled, setAnglesEnabled] = useState(enabled);
  const [angleStepState, setAngleStep] = useState(angleStep);

  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);

  const snapToAngle = useCallback((start: Point, end: Point): Point => {
    if (!anglesEnabled) return end;
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    
    // Snap to angle steps (default 45 degrees)
    const snapAngle = Math.PI * (angleStepState / 180);
    const snappedAngle = Math.round(angle / snapAngle) * snapAngle;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return {
      x: start.x + distance * Math.cos(snappedAngle),
      y: start.y + distance * Math.sin(snappedAngle)
    };
  }, [anglesEnabled, angleStepState]);

  return {
    anglesEnabled,
    setAnglesEnabled,
    angleStep: angleStepState,
    setAngleStep,
    toggleAngles,
    snapToAngle
  };
};

export default useLineAngleSnap;
