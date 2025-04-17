
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { snapToAngle as snapToAngleUtil } from '@/utils/grid/snapping';
import { lineToolLogger } from '@/utils/logger';

interface UseLineAngleSnapOptions {
  enabled?: boolean;
  snapAngleDeg?: number;
}

/**
 * Hook for angle snapping functionality
 */
export const useLineAngleSnap = ({ 
  enabled = false,
  snapAngleDeg = 45
}: UseLineAngleSnapOptions = {}) => {
  const [anglesEnabled, setAnglesEnabled] = useState(enabled);
  
  /**
   * Snap a line to standard angles
   * @param start Starting point
   * @param end End point to be adjusted
   * @returns Adjusted end point
   */
  const snapToAngle = useCallback((start: Point, end: Point): Point => {
    if (!anglesEnabled) return end;
    
    return snapToAngleUtil(start, end, snapAngleDeg);
  }, [anglesEnabled, snapAngleDeg]);
  
  /**
   * Toggle angle constraints
   */
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => {
      const newValue = !prev;
      lineToolLogger.debug(`Angle constraints ${newValue ? 'enabled' : 'disabled'}`);
      return newValue;
    });
  }, []);
  
  return {
    anglesEnabled,
    setAnglesEnabled,
    snapToAngle,
    toggleAngles
  };
};
