
import { useCallback } from 'react';
import { MeasurementData } from './useStraightLineTool';

interface TooltipData {
  distanceDisplay: string;
  angleDisplay: string;
  snappedInfo: string;
}

export const useLiveDistanceTooltip = () => {
  // Format measurement data for display
  const formatTooltipData = useCallback((data: MeasurementData): TooltipData | null => {
    if (!data || data.distance === null) return null;
    
    // Format distance with 1 decimal place
    const distanceDisplay = `${data.distance.toFixed(1)}${data.unit}`;
    
    // Format angle if available
    const angleDisplay = data.angle !== null ? ` / ${Math.round(data.angle)}°` : '';
    
    // Show if snapped to grid or angle
    const snappedInfo = data.snapped ? 
      ` (${data.snapType === 'angle' ? 'Angled' : data.snapType === 'grid' ? 'Snapped' : 'Snapped'})` : '';
    
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
