
import { useCallback } from 'react';
import type { MeasurementData } from '../useStraightLineTool.d';

interface TooltipData {
  distanceDisplay: string;
  angleDisplay: string;
  snappedInfo: string;
}

export const useLiveDistanceTooltip = () => {
  /**
   * Formats measurement data for display in the tooltip
   */
  const formatTooltipData = useCallback((data: MeasurementData): TooltipData | null => {
    if (!data || data.distance === null) return null;
    
    // Format distance with units
    const distanceDisplay = `${data.distance.toFixed(2)} ${data.unit}`;
    
    // Format angle if available
    const angleDisplay = data.angle !== null ? `${Math.round(data.angle)}°` : '';
    
    // Show snapping information if relevant
    let snappedInfo = '';
    if (data.snapped) {
      if (data.snapType === 'grid') snappedInfo = ' (grid)';
      else if (data.snapType === 'angle') snappedInfo = ' (angle)';
      else if (data.snapType === 'both') snappedInfo = ' (grid+angle)';
      else snappedInfo = ' (snapped)';
    }
    
    return {
      distanceDisplay,
      angleDisplay,
      snappedInfo
    };
  }, []);
  
  return {
    formatTooltipData
  };
};
